const createFormData = (data) => {
    let payload = new FormData();
    const keys = Object.keys(data);
    keys.forEach((key) => {
        payload.append(key, data[key])
    })
    return payload;
}

export default createFormData;