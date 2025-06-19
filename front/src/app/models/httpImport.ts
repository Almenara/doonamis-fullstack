export interface HttpImport {
    status: string;
    data:   Data;
}

export interface Data {
    message: Message;
}

export interface Message {
    success:    string;
    errors:     string;
    details?:   Error[];
}

export interface Error {
    user:   User;
    errors: string[];
}

export interface User {
    name:      null | string;
    last_name: null | string;
    email:     null | string;
    phone:     null | string;
    address:   null | string;
}