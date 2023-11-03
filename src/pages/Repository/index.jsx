import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';
import api from '../../services/api';

export default function Repository() {
    const { repositorio } = useParams();

    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertas', active: false },
        { state: 'closed', label: 'Fechadas', active: false }
    ]);
    const [filterIndex, setFilterIndex] = useState(0);

    useEffect(() => {
        async function load() {
            const repositoryName = decodeURIComponent(repositorio);

            const [repositoryData, issuesData] = await Promise.all([
                api.get(`/repos/${repositoryName}`),
                api.get(`/repos/${repositoryName}/issues`, {
                    params: {
                        state: filters.find(filter => filter.active).state,
                        per_page: 5
                    }
                })
            ]);

            setRepository(repositoryData.data);
            setIssues(issuesData.data);
            setLoading(false);

        }

        load();
    }, [repositorio, filters]);

    useEffect(() => {
        async function loadIssues() {
            const repositoryName = decodeURIComponent(repositorio);

            const issuesData = await api.get(`/repos/${repositoryName}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5
                }
            });

            setIssues(issuesData.data);
        }

        loadIssues();
    }, [page, repositorio, filters, filterIndex]);

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1);
    }

    function handleFilter(filterIndex) {
        setFilterIndex(filterIndex);
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    }
    return (
        <Container>

            <BackButton to='/'>
                <FaArrowLeft color='#000' size={30} />
            </BackButton>

            <Owner>
                <img
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                />
                <h1>{repository.name}</h1>
                <p>{repository.description}</p>
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button
                        type='button'
                        key={filter.label}
                        onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>

                            <p>{issue.user.login}</p>

                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button type='button' onClick={() => handlePage('back')} disabled={page < 2}>Voltar</button>
                <button type='button' onClick={() => handlePage('next')}>Próxima</button>
            </PageActions>
        </Container>
    );
}