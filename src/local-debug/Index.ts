interface HelloResponse {
    statusCode: number;
    body: string;
}

exports.handler = async (event: any) => {
    let body;
    try{
        body = JSON.parse(event.body);
    }
    catch{
        body = event.body;
    }
    try {
        if (body.userName === "pavan") {
            throw new Error("Something bad happened");
        }
    } catch (e) {
        console.log(e);
        const response: HelloResponse = {
            statusCode: 400,
            body: JSON.stringify({
                status: "Failed",
                message: "Login Failed..."
            })
        };
        return Promise.resolve(response);
    }

    if(body.password === process.env.PASSWORD)
    {
        const response: HelloResponse = {
            statusCode: 200,
            body: JSON.stringify({
                status: "Success",
                message: "Login Successful..."
            })
        };
        return Promise.resolve(response);
    }
    else {
        const response: HelloResponse = {
            statusCode: 400,
            body: JSON.stringify({
                status: "Failed",
                message: "Login Failed..."
            })
        };
        return Promise.resolve(response);
    }
};