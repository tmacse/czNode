const express = require('express');
const router = express.Router();
const NoticeModel = require('../model/NoticeModel.js');

//获取新闻总量
router.get('/totalNum', (req, res) => {
    NoticeModel.find().countDocuments()
        .then((total) => {
            res.send({ status: 0, totalNotices: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
//添加通知
router.post('/add', (req, res) => {
    let { title, author, department, content, category } = req.body
    //判断上述字段都不能为空
    if (title && author && department && content && category) {
        NoticeModel.find({ title }).then((data) => {
            if (data.length === 0) {
                //文章不存在，可以添加
                return NoticeModel.insertMany({ title, author, department, content, category })
            } else {
                res.send({ err: -3, msg: '文章已经存在' })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加文章成功' })
        }).catch((err) => {
            res.send({ err: -2, msg: '添加文章失败' })
            console.log(err)
        })
    } else {
        return res.send({ err: -1, msg: '参数错误' })
    }
})

//删除通知
router.post('/delete', (req, res) => {
    const { title } = req.body
    NoticeModel.deleteOne({ title })
        .then(() => {
            res.send({ err: 0, msg: '删除通知成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '删除通知失败' })
        })
})

//更新通知
router.post('/update', (req, res) => {
    const notice = req.body
    const { _id } = req.body;
    console.log('11111', _id, req.body)
    NoticeModel.findOneAndUpdate({ _id }, notice)
        .then(() => {
            res.send({ err: 0, msg: '更新成功' })
        }).catch((err) => {
            console.log('更新通知异常', err)
            res.send({ err: -1, msg: '更新失败' })
        })
})


router.get('/search', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        Title,
        Content,
        Author,
        Department,
    } = req.query
    let contition = {}
    if (Title) {
        contition = {
            title: new RegExp(`^.*${Title}.*$`)
        }
    } else if (Content) {
        contition = {
            content: new RegExp(`^.*${Content}.*$`)
        }
    }
    else if (Author) {
        contition = {
            author: new RegExp(`^.*${Author}.*$`)
        }
    }
    else if (Department) {
        contition = {
            department: new RegExp(`^.*${Department}.*$`)
        }
    }

    NoticeModel.find(contition).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})

//得到指定数组的分页信息对象
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total
    const list = []
    for (var i = start; i < end; i++) {
        list.push(arr[i])
    }
    return { pageNum, total, pages, pageSize, list }
}
module.exports = router