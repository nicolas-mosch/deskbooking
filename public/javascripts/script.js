$(function() {
    $("input").on("click", (e) => {
        date = new Date($("#start_date").val())
        date.setDate(date.getDate() + parseInt($(e.target).val().split("_")[1]));
        console.log(date)
        payload = {
            name: $("#name_input").val(),
            desk: $(e.target).val().split("_")[0],
            date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        }
        console.log(payload);
        $.post("/",
        payload,
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    })
});