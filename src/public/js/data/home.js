$(document).ready(function () {
    
    showMenu();
    filterPrice();

});


// Hiệu ứng menu left
function showMenu () {
    $('.category-item').click(function () {
        
        if ($(this).hasClass("active")) {
            $(this).children(".category-list__sub-menu").slideUp("slow");
            $(this).removeClass("active");
        }else {
            $(".category-list__sub-menu").slideUp("slow");
            $(this).children(".category-list__sub-menu").slideDown("slow");

            $(".category-item").removeClass("active");
            $(this).addClass("active");
        }

    });
}

// Tìm kiểm sản phẩm theo giá

function filterPrice() {

    const btnFilterPrice = $('.btnFilterPrice');

    btnFilterPrice.click(function() {

        let priceStart = $('#txtPriceStart').val();
        let priceEnd = $('#txtPriceEnd').val();

        // Gửi dữ liệu lên server
        $.ajax({
            
            url: '/filter-price',
            type: 'POST',
            data: {
                priceStart: priceStart,
                priceEnd: priceEnd,
            },

            success: function(data) {

                console.log(data);

                //render html
                const newArr = data.map(function(item) {
                    return ` <div class="gird__column-2-4">
                    <div class="home-product-item">
                        <a href="/product/${ item.slug }">
                            <div class="home-product-item__img" style="background-image: url('../../../image/${ item.image }');"></div>
                        </a>
                        <h4 class="home-product-item__name">${ item.name }</h4>
                        <div class="home-product-item__price">
                            <span class="home-product-item__price-old">${ item.price } đ</span>
                            <span class="home-product-item__price-current">${ item.price } đ</span>

                        </div>
                        <div class="home-product-item__action">
                            <span class="home-product-item__like">
                                <i class="far fa-heart"></i>
                                <!-- <i class="fas fa-heart"></i     -->
                            </span>
                            <div class="home-product-item__rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>

                      

                        <div class="home-product-item__origin">
                            <span class="home-product-item__brand">Whoo</span>
                            <span class="home-product-item__origin-title">Hàn Quốc</span>
                        </div>

                        <div class="home-product-item__favourite">
                            <i class="fas fa-check home-product-item__favourite-icon"></i>
                            <span class="home-product-item__favourite-title">Yêu thích</span>
                        </div>

                        <div class="home-product-item__safe-off">
                            <span class="home-product-item__safe-off-percent">10%</span>
                            <span class="home-product-item__safe-off-label">Giảm</span>
                        </div>
                    </div>
                </div>  `;
                });

                document.getElementById('search__content').innerHTML = newArr;


            },

            error: function(error) {
                console.log(error);
                console.log('process error');
            },
        });

    });

}