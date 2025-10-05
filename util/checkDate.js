function isOverlapping(start1, end1, start2, end2) {
    const startTime1 = new Date(start1)
    const endTime1 = new Date(end1)
    const startTime2 = new Date(start2)
    const endTime2 = new Date(end2)

    console.log(startTime1,endTime1,startTime2,endTime2)

    return !(endTime1 < startTime2 || endTime2 < startTime1);
}


module.exports = {isOverlapping}