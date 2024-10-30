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
        console.log('2')
        var url = 'http://localhost:3000/register'
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({a: 1, b: 'Textual content'})
        body: JSON.stringify({
            username: userTryingtoRegister.username,
            passoword: userTryingtoRegister.password
        })
        });

        // return await response.json();
    }
}

export const loginRepository = new LoginRepository;