import { useCallback, useEffect, useState } from 'react';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteRepo } from './styles';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Main() {
    const [newRepository, setNewRepository] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const repositoriesStorage = localStorage.getItem('@favrepohub/repositories');

        if (repositoriesStorage) {
            setRepositories(JSON.parse(repositoriesStorage));
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('@favrepohub/repositories', JSON.stringify(repositories));
    }, [repositories]);

    function handleinputChange(event) {
        setNewRepository(event.target.value);
        setAlert(false);
    }

    const handleSubmit = useCallback((event) => {
        event.preventDefault();

        async function submit() {
            setLoading(true);

            try {
                if (!newRepository) {
                    throw new Error('Você precisa indicar um repositório!');
                }

                const hasRepository = repositories.find(repository => repository.name === newRepository);
                if (hasRepository) {
                    throw new Error('Repositorio duplicado!');
                }

                const response = await api.get(`repos/${newRepository}`);

                const data = {
                    name: response.data.full_name,
                };

                setRepositories([...repositories, data]);

                setNewRepository('');
                setAlert(false);

            } catch (error) {
                setAlert(true);
                console.log(error);
            } finally {
                setLoading(false);
            }

        }


        submit();

    }, [newRepository, repositories]);

    const handleDelete = useCallback((repositoryToDelete) => {
        const newRepositories = repositories.filter(repository => {
            return repository.name !== repositoryToDelete;
        });
        setRepositories(newRepositories);
    }, [repositories]);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositórios
            </h1>

            <Form onSubmit={handleSubmit} data-custom-error={alert}>
                <input
                    type='text'
                    placeholder='Adicionar repositórios'
                    value={newRepository}
                    onChange={handleinputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color='#FFF' size={14} />
                    ) : (
                        <FaPlus color='#FFF' size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositories.map(repository => (
                    <li key={repository.name}>
                        <span>
                            <DeleteRepo onClick={() => handleDelete(repository.name)}>
                                <FaTrash size={14} />
                            </DeleteRepo>
                            {repository.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repository.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    );
}