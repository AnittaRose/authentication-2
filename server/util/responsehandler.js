exports.successfunction = function successfunction(api_data){
    let res = {
        success : true,
        statuscode : 200,
        data : api_data.data ? api_data.data : null,
        messaage : api_data.message ? api_data.message : null
       
    }
    return res;
}

exports.errorfunction = function errorfunction(api_data){
    let res = {
        success : false,
        statuscode : 400,
        messaage : api_data.message ? api_data.message : null,
        data : api_data.data ? api_data.data : null
    }
    return res;
}