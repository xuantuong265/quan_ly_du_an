$( document ).ready(function() {
    minusCart();
    plusCart();
    checkedDelete();
    payment();

    // modal button
    let productID;
    let btnDelete = $(".btnDelete");

    // xóa 1 sản phẩm trong giỏ hàng
    btnDelete.click(function(event) {

        productID = $(this).attr("data-id");
        console.log(productID);

        $.ajax({
            url: '/delete-cart',
            type: 'POST',
            data: JSON.stringify({
                id: productID,
            }),
            dataType: "json",
            cache: false, 
            contentType: "application/json",

            success: function(data) {

                console.log(data);
                $('body').load('/list-cart');
                
            },

            error: function(error) {
                console.log(error);
                console.log('process error');
            },
        });

    });



});

function minusCart() {

    $('.btnMinus').click(function() {
       
       let productID = $(this).attr("data-id");
         let value = $('#' + productID).val();

         if (value) {

             value = parseInt(value);

             if (value > 1) {
                 value = value - 1;

                 // Gửi lên server cập nhật lại session giá và số lượng
                $.ajax({
                    url: '/minus-cart',
                    type: 'POST',
                    data: JSON.stringify({
                        id: productID,
                        qty: value,
                    }),
                    dataType: "json",
                    cache: false, 
                    contentType: "application/json",

                    success: function(data) {

                       let filter = data.filter((cart) => {
                           return cart._id === productID;
                       });

                       

                       let totalQty = 0, total = 0;
                       for (let i = 0; i < data.length; i++) {
                           totalQty += parseInt(data[i].qty);
                           total += parseInt(totalQty) * parseFloat(data[i].price);
                       }


                       document.getElementById('totalQty').innerHTML = totalQty;
                       document.getElementById('total__money').innerHTML = parseFloat(total).toLocaleString(window.document.documentElement.lang) + ' đ';
                       
                        $('#' + productID).val(filter[0].qty);
                        $('.' + productID).text(parseFloat((parseInt(filter[0].qty) * parseFloat(filter[0].price))).toLocaleString(window.document.documentElement.lang) + ' đ');
                    },

                    error: function(error) {
                        console.log(error);
                        console.log('process error');
                    },
                });
                 
             }
         }

   });
}

function plusCart() {

    $('.btnPlus').click(function(event) {

         let productID = $(this).attr("data-id");
         let value = $('#' + productID).val();

         if (value) {

             value = parseInt(value);

             if (value < 10) {
                 value = value + 1;

                 // Gửi lên server cập nhật lại session giá và số lượng
                $.ajax({
                    url: '/plus-cart',
                    type: 'POST',
                    data: JSON.stringify({
                        id: productID,
                        qty: value,
                    }),
                    dataType: "json",
                    cache: false, 
                    contentType: "application/json",

                    success: function(data) {

                       let filter = data.filter((cart) => {
                           return cart._id === productID;
                       });

                       

                       let totalQty = 0, total = 0;
                       for (let i = 0; i < data.length; i++) {
                           totalQty += parseInt(data[i].qty);
                           total += parseInt(totalQty) * parseFloat(data[i].price);
                       }

                       document.getElementById('totalQty').innerHTML = totalQty;
                       document.getElementById('total__money').innerHTML = parseFloat(total).toLocaleString(window.document.documentElement.lang) + ' đ';
                       
                        $('#' + productID).val(filter[0].qty);
                        $('.' + productID).text(parseFloat((parseInt(filter[0].qty) * parseFloat(filter[0].price))).toLocaleString(window.document.documentElement.lang) + ' đ');
                    },

                    error: function(error) {
                        console.log(error);
                        console.log('process error');
                    },
                });
                 
             }
         }

    });

   
    
}

function checkedDelete() {

    let checkAll = $('#checkAll');
    let checkItem = $('input[name="checkItem[]"]');
    let btnHandle = $('.btnHandle');

    // check all 
    checkAll.change(function(event) {
       let isChecked = $(this).prop('checked');
       $('input[name="checkItem[]"]').prop('checked', isChecked); // nếu check all thì sẽ checked hết các item
    });

    // check item
    checkItem.change(function(event) {
        // kiểm tra xem số lượng item đã check có bằng số lượng của item hay không
        let isChecked = checkItem.length === $('input[name="checkItem[]"]:checked').length;
        checkAll.prop('checked', isChecked); // check all
    });

    // click btnHandle
    btnHandle.click(function(event) {

        // Gửi lên server cập nhật lại session giá và số lượng
        $.ajax({
            
            url: '/handle-cart',
            type: 'POST',
            data: $('#formContent').serialize(),

            success: function(data) {

                console.log(data);
                 $('body').load('/list-cart');
            },

            error: function(error) {
                console.log(error);
                console.log('process error');
            },
        });
    });

}

function payment() {

    let formPayment = $('#formPayment');
    let btnSubmitPay = $('#btnSubmitPay');

    btnSubmitPay.click(function() {
        
        // Gửi lên server cập nhật lại session giá và số lượng
        $.ajax({
            
            url: '/payment-cart',
            type: 'POST',
            data: {
                userName: $('#userName').val(),
                address: $('#address').val(),
                phone: $('#phone').val(),
                total: $('#total').val(),
            },

            success: function(data) {

                console.log(data);
                window.location.href = '/home';
                alert('Mua hàng thành công');
            },

            error: function(error) {
                console.log(error);
                console.log('process error');
            },
        });

    });

}