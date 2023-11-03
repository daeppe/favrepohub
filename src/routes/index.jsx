import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import Main from '../pages/Main';
import Repository from '../pages/Repository';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' element={<Main />} />
                <Route exact path='/repositorio/:repositorio' element={<Repository />} />
            </Switch>
        </BrowserRouter>
    );
}