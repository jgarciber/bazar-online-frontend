class LoginRepository{
    async getUserLoginAPI(userTryingToLog){
        // const url = `http://localhost:3000/login?username=${userTryingToLog.username}&password=${userTryingToLog.password}`
        const url = 'http://localhost:3000/login'
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
        var url = 'http://localhost:3000/signup'
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({a: 1, b: 'Textual content'})
        body: JSON.stringify({
            username: userTryingtoRegister.username,
            password: userTryingtoRegister.password
        })
        });
        if(response.ok) return await response.text();
        // return await response.json();
    }
}

export const loginRepository = new LoginRepository;