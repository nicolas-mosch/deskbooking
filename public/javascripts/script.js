$(function() {
    $("#week").on("change", (e) => {
        const BASE_URL = window.location.origin
        year = $(e.target).val().split("-")[0]
        week = $(e.target).val().split("W")[1]
        window.location.href = `${BASE_URL}/${year}/${week}`;
    });
    
    $(".reserve").on("click", (e) => {
        if ($(e).is(':checked')) {
            payload = {
                name: "",
                week: $("#week").val(),
                desk: $(e.target).val().split("_")[0],
                day: $(e.target).val().split("_")[1]
            }
            console.log(payload);
            $.post("/reserve",
            payload,
            function(data, status){
                console.log("status: ", status);
                if(status == "success"){
                    // $(e.target).prop("checked", false);
                    location.reload()
                }
            });
        } else {
          
            payload = {
                name: $("#name_input").val(),
                week: $("#week").val(),
                desk: $(e.target).val().split("_")[0],
                day: $(e.target).val().split("_")[1]
            }
            console.log(payload);
            $.post("/reserve",
            payload,
            function(data, status){
                console.log("status: ", status);
                if(status == "success"){
                    // $(e.target).prop("checked", true);
                    location.reload()
                }
            });
        }
    })
});