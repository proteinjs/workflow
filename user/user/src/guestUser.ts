import moment from 'moment';
import { User } from './tables/UserTable';

export const guestUser: User = {
    name: 'Guest',
    email: 'guest',
    password: 'guest',
    emailVerified: false,
    roles: '',
    created: moment(),
    updated: moment(),
    id: '',
};