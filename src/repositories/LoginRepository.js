class LoginRepository{
    async getUserLoginAPI(userTryingToLog){
        // const url = import.meta.env.VITE_HOST + `/login?username=${userTryingToLog.username}&password=${userTryingToLog.password}`
        const url = import.meta.env.VITE_HOST + '/login'
        const response = await fetch((url), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({a: 1, b: 'Textual content'})
            body: JSON.stringify({
                username: userTryingToLog.username,
                password: userTryingToLog.password
            })
        });
        return await response.json();
    }

    async postUserLoginAPI(userTryingtoRegister){
        var url = import.meta.env.VITE_HOST + '/signup'
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
        })
        });
        return await response.json();
    }
}

export const loginRepository = new LoginRepository;