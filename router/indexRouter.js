const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const NoticeModel = require('../model/NoticeModel.js');
const DepartmentMessageModel = require('../model/DepartmentMessageModel');
//这是一个前段获取界面的router

router.get('/homedata', async (req, res) => {
    //强军阶梯栏目左边的精品课程，最多显示6个
    const curriculumlist = await ArticleModel.find({ "category": '精品课程' })
        .sort({ date_time: -1 }).limit(6)
    //第一层栏目中右边的通知列表
    const noticelist = await NoticeModel.find()
        .sort({ date_time: -1 }).limit(6)
    //强军阶梯栏目中间的案例分析列表
    const casebooklist = await ArticleModel.find({ "category": '案例分析' })
        .sort({ date_time: -1 }).limit(6)
    //活动概况列表（包括左侧图片展示和右侧文字展示）
    const summarylist = await ArticleModel.find({ "category": '活动概况' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中部队管理办的消息列表
    const governmentlist = await DepartmentMessageModel.find({ "department": "部队管理办" })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中战勤办的消息列表
    const trainlist = await DepartmentMessageModel.find({ 'department': '战勤办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中组织办的消息列表
    const organizationlist = await DepartmentMessageModel.find({ 'department': '组织办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中宣传保卫办的消息列表
    const propagationlist = await DepartmentMessageModel.find({ 'department': '宣传保卫办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中人力资源办的消息列表
    const manpowerlist = await DepartmentMessageModel.find({ 'department': '人力资源办' })
        .sort({ date_time: -1 }).limit(6)
    Promise.all(
        [
            curriculumlist, noticelist, casebooklist, summarylist,
            governmentlist, trainlist, organizationlist, propagationlist, manpowerlist
        ]
    ).then((result) => {
        res.send(
            {
                success: true,
                data: {
                    'curriculumlist': result[0],
                    'noticelist': result[1],
                    'casebooklist': result[2],
                    'summarylist': result[3],
                    'governmentlist': result[4],
                    'trainlist': result[5],
                    'organizationlist': result[6],
                    'propagationlist': result[7],
                    'manpowerlist': result[8]
                }
            })
    })
})
//获取详情页面（包括通知，精品课程，案列分析，活动概况等）
router.get('/ByID', (req, res) => {
    const { _id } = req.query
    const modelList = [ArticleModel, NoticeModel, DepartmentMessageModel]
    for (let i = 0; i < 3; i++) {
        modelList[i].find({ _id: _id }).then((data) => {
            //判定data是否是空数组，如果是空数组，不执行，将不是空数组的结果data推送至前端
            if (JSON.stringify(data) === '[]') {
                console.log('这是一个空值', data)
            }
            else {
                console.log('222', data)
                res.send({ err: 0, data: data });
            }
        })
    }
})


//获取视频地址
router.get('/getVideoByID', (req, res) => {
    const { _id } = req.query
    VideoModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
})
//获取音乐地址
router.get('/getMusicByID', (req, res) => {
    const { _id } = req.query
    MusicModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router