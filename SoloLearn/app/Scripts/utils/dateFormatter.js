import moment from 'moment';

const updateDate = (date) => {
    let postDate = moment.utc(date);
    let currentDate = moment.utc(new Date());
    let formattedDate = "";


    let diffWeeks = currentDate.diff(postDate, 'weeks');

    if (diffWeeks > 4) {
        formattedDate = moment(postDate.toDate()).format("Do MMMM YYYY");
    }
    else {
        formattedDate = currentDate.diff(postDate) < 0 ? "a few seconds ago" :moment(moment.utc(postDate.toDate())).fromNow();
    }

    return formattedDate;
}

export default updateDate;