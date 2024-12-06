class LoginRepository{
    async getUserLoginAPI(userTryingToLog){
        const url = import.meta.env.VITE_HOST + '/login'
        const response = await fetch((url), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userTryingToLog.username,
                password: userTryingToLog.password
            })
        });
        return await response.json();
    }

    async postUserLoginAPI(userTryingtoRegister){
        var url = import.meta.env.VITE_HOST + '/users'
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userTryingtoRegister.username,
            firstName: userTryingtoRegister.firstName,
            lastName: userTryingtoRegister.lastName,
            email: userTryingtoRegister.email,
            password: userTryingtoRegister.password,
            isAdmin: String(false),
            isActive: String(true)
        })
        });
        return await response.json();
    }
}

export const loginRepository = new LoginRepository;