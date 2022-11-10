import $ from 'jquery'

export default function getForgeAuthToken(callback) {
    $.ajax({
        method: "GET",
        async: false,
        url: "http://view-dev.corp.local/viewer/auth.php",
        success: function (data) {
            callback(data.access_token, data.expires_in)
        }
    })
}