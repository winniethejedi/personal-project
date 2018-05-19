function handleDbError(res) {
    return (err, ...args) => {
        console.warn('hit a snag');
        console.error(err);

        if (err.code == 'ECONNRESET') {
            return res.status(500).send({ message: 'something died again' });
        }
        if (err.code == '22P02') {
            res.status(422).send({ message: 'The request had incorrect or missing properties: ' + err.message });
        }
        res.status(500).send({ message: 'Internal Server Error' })
    };
}

module.exports = handleDbError;