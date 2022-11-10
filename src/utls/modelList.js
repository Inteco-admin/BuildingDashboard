import $ from 'jquery'

export default function GetModelList() {
    let res = null
    $.ajax({
        method: "GET",
        async: false,
        url: "http://view-dev.corp.local/api/modellist.php",
    }).done(r =>
        res = r
    )
    return res
}