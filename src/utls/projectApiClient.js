import $ from 'jquery'

export function getDataFromProject(mname, adate) {
    let res
    $.ajax({
        method: "GET",
        async: false,
        url: "http://view-dev.corp.local/api/elements2.php",
        data: {
            mname: mname,
            adate: adate
        }
    }).done(data => {

        res = data
    })
    return res
}