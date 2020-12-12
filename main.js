//Merch Items

$(document).ready(
    function () {

        //delivery info validations for Merch checkout
        var myRules = {
            street:{
                required: true
            },
            city:{
                required: true
            },
            zipcode:{
                required: true,
                digits: true
            },
            phonenumber:{
                required: true,
                digits: true,
                minLength: 10,
                maxLength: 10
            },
            email:{
                required: true
            }
        }
        var myMessages = {
            street:{
                required: "please enter a street address"
            },
            city:{
                required: "please enter a city"
            },
            zipcode:{
                required: "please enter a valid zipcode",
                digits: "please enter a valid zipcode"
            },
            phonenumber:{
                required: "Please enter a valid phone number",
                digits: "Please enter a valid phone number",
                minLength: "Please enter a valid phone number",
                maxLength: "Please enter a valid phone number",
            },
            email:{
                required: "please enter a valid email"
            }
        }
        $("#deliveryForm").validate(
            {
                submitHandler: submitOrder,
                rules: myRules,
                messages: myMessages
            }
        );

        var sCart = [];
        var cartObj;
        var modalPrice;

        //add event handlers
        $("a").click(showTab);
        $(".merchBox").click(merchClick);
        $(".close").click(closeModal);
        $("#addToCart").click(updateCart);
        $("#coSubmit").click(goToDelivery);
        $("#back").click(goToCart);
        $("#quant").change(calcPrice);
        $("#sSize").change(calcPrice);
        $("#mFormat").change(calcPrice);

        //webpage tab handler
        function showTab(event) {
            event.preventDefault();
            $(this).tab("show");
        }

        //change to delivery tab when user clicks check out
        function goToDelivery(){
            event.preventDefault();
            $("#delivery").css("display","block");
            $("#cart").css("display","none");
        }

        //change to cart tab when user clicks back
        function goToCart(){
            event.preventDefault();
            $("#cart").css("display","block");
            $("#delivery").css("display","none");
        }

        //all other functions (program logic)
        function merchClick(){
            var mItem = $(this).attr('name')
            displayModal(mItem);
        }

        // When the user clicks the div item, open the modal
        function displayModal(item) {
            cartObj = item;
            var itemImage;
            var itemName;

            switch(item){
                case "album1":
                    itemImage = "resources/album1.jpg"
                    itemName = "Tallymoore"
                    break;
                case "album2":
                    itemImage = "resources/album2.jpg"
                    itemName = "Drive"
                    break;
                case "album3":
                    itemImage = "resources/album3.jpg"
                    itemName = "One Foot Across the Ocean"
                    break;
                case "tshirt":
                    itemImage = "resources/shirt.jpg"
                    itemName = "Tallymoore T-Shirt"
                    break;
            }

            var imageTag = '<div class="row modalImg"><img class="modalImg" src="' + itemImage + '" height="200" width="200"></div>'
            var nameTag = '<div class="col-12 modalName"><p class="modalTitle">' + itemName + '</p></div>'

            $(".modalImg").replaceWith(imageTag);
            $(".modalName").replaceWith(nameTag);

            if(item == "album1" || item == "album2" || item == "album3"){
                $("#cdFormat").css("display","block ruby");

                //set a default price for shirts to show in modal
                $("#itemPrice").text("$15");
            }
            if(item == "tshirt"){
                $("#shirtFields").css("display","block");

                //set a default price for shirts to show in modal
                $("#itemPrice").text("$20");
            }

            $("#myModal").css("display","block");
            $("#cdMerch").css("display", "block");
        }

        //close the modal when the user clicks the x
        function closeModal(){
            $(".modal").css("display","none");
            $("#shirtFields").css("display","none");
            $("#cdFormat").css("display","none");
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        //calculate the price that shows in the modal
        function calcPrice(){
            var basePrice;
            var totalPrice;
            var quantity = parseInt($("#quant").val());

            if(cartObj == "album1" || cartObj == "album2" || cartObj == "album3"){
                basePrice = parseFloat($("#mFormat").val());
            }
            if(cartObj == "tshirt"){
                var size = $("#sSize").val();
                if(size == "small" || size == "medium" || size == "large"){
                    basePrice = 20;
                }
                else{
                    basePrice = 23;
                }
            }

            totalPrice = basePrice * quantity;
            modalPrice = "$" + totalPrice;

            if(basePrice && quantity){
                $("#itemPrice").text(modalPrice);
            }
        }

        //update the cart when the user clicks add to cart
        function updateCart(){
            event.preventDefault();

            var tempObj ={};
            var cartDiv = '';
            var cartQuant = $("#quant").val();
            var cartTotal = 0;

            //create temp object to hold the item data and push it to the cart array
            switch(cartObj){
                case "album1":
                    tempObj.title = "Tallymoore";
                    tempObj.picture = "resources/album1.jpg";
                    tempObj.quant = cartQuant;
                    tempObj.type = "album";
                    break
                case "album2":
                    tempObj.title = "Drive";
                    tempObj.picture = "resources/album2.jpg";
                    tempObj.quant = cartQuant;
                    tempObj.type = "album";
                    break;
                case "album3":
                    tempObj.title = "One Foot Across the Ocean";
                    tempObj.picture = "resources/album3.jpg";
                    tempObj.quant = cartQuant;
                    tempObj.type = "album";
                    break;
                case "tshirt":
                    tempObj.title = "Tallymoore T-Shirt";
                    tempObj.picture = "resources/shirt.jpg";
                    tempObj.color = $("#sColor").val();
                    tempObj.quant = cartQuant;
                    tempObj.type = "shirt";
                    break;
            }
            if(tempObj.type == "album"){
                var cdFormat = $("#mFormat").val();
                if(cdFormat == 12.5){
                    tempObj.price = cartQuant * 12.5;
                    tempObj.mFormat = "digital"
                }
                else{
                    tempObj.price = cartQuant * 15;
                    tempObj.mFormat = "physical"
                }
            }
            else{
                var shirtSize = $("#sSize").val();
                tempObj.size = shirtSize;

                if(shirtSize == "small" || shirtSize == "medium" || shirtSize == "large"){
                    tempObj.price = cartQuant * 20;
                }
                else{
                    tempObj.price = cartQuant * 23;
                }
            }
            sCart.push(tempObj);

            //update the cart section to show the items
            for(i=0;i<sCart.length;i++){
                if (sCart[i].type == "album"){
                    cartDiv += '<div class="row cartItem">' +
                        '<div class="col-3">' +
                        '<img class="cartImg" src="' + sCart[i].picture + '" width="100" height="100">' +
                        '</div>' +
                        '<div class="col-5">' +
                        '<p class="cartSummary">Album: ' + sCart[i].title + '</p>' +
                        '<p class="cartSummary">Format: ' + sCart[i].mFormat + '</p>' +
                        '<p class="cartSummary">Quantity: ' + sCart[i].quant + '</p>' +
                        '</div>' +
                        '<div class="col-4 priceCol">' +
                        '<p class="cartPrice">$ ' + sCart[i].price + '</p>' +
                        '</div>' +
                        '</div>';
                }
                else{
                    cartDiv += '<div class="row cartItem">' +
                        '<div class="col-3">' +
                        '<img class="cartImg" src="' + sCart[i].picture + '" width="100" height="100">' +
                        '</div>' +
                        '<div class="col-5">' +
                        '<p class="cartSummary">Item: ' + sCart[i].title + '</p>' +
                        '<p class="cartSummary">Size: ' + sCart[i].size + '</p>' +
                        '<p class="cartSummary">Color: ' + sCart[i].color + '</p>' +
                        '<p class="cartSummary">Quantity: ' + sCart[i].quant + '</p>' +
                        '</div>' +
                        '<div class="col-4">' +
                        '<p class="cartPrice">$' + sCart[i].price + '</p>' +
                        '</div>' +
                        '</div>';
                }

                cartTotal += sCart[i].price;
            }

            //output items and total price to shipping cart
            var cartTotalOutput = "$" + cartTotal
            var cartMerch = '<div id="cartMerch">' + cartDiv + '</div>';
            $("#cartMerch").replaceWith(cartMerch);
            $("#cartTotal").text(cartTotalOutput);

            //close the modal
            $(".modal").css("display","none");
            $("#shirtFields").css("display","none");
            $("#cdFormat").css("display","none");
        }

        function submitOrder(){
            event.preventDefault();

            $("#deliveryModal").css("display","block")
        }
    }
)

var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 10000);
}

