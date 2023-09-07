const Authorization = async (req, res, next) => {
    try{
        let { uid } = req.cookies;
        if(!uid){
            uid = Date.now();
            res.cookie('uid', uid, {expires: new Date((Date.now() + ((999 * 60 * 60 * 60) * 1000))) });
        }
        next(uid);
    }catch(error){
        return res.json({error});
    }
}

module.exports = Authorization;