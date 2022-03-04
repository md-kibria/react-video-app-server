function errRes(res, err, msg) {
    res.status(400).json({
        status: 'fail',
        msg: msg || 'Error occured!',
        error: err.message
    })
}

module.exports = errRes