document.addEventListener('DOMContentLoaded', function() {
    $(document).on('change', '.error', function() {
        $(this).removeClass('error');
    })

    $('.js-form button').on('click', function(event){
        event.preventDefault();
        var dataForAjax = "action=form&";
        var addressForAjax = myajax.url;
        var valid = true;
        
        $(this).closest('form').find('input:not([type=submit]),textarea, select').each(function(i, elem) {
            if (this.value.length < 3 && $(this).hasClass('required')) {
                valid = false;
                $(this).addClass('error');
            }
            if ($(this).attr('name') == 'email' && $(this).hasClass('required')) {
                var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
                if (!pattern.test($(this).val())) {
                    valid = false;
                    $(this).addClass('error');
                }
            }
            if ($(this).attr('name') == 'agree' && !$(this).prop("checked")) {
                $(this).addClass('error');
                valid = false;
            }

            if($(this).attr('name') == 'phone' && $(this).hasClass('required')) {
                console.log(this.value.replace(/[_-]/g, '').length);
                if (this.value.replace(/[_-]/g, '').length!=16)
                {
                    valid = false;
                    $(this).addClass('error');
                }
            } 

            if (i > 0) {
                dataForAjax += '&';
            }
            dataForAjax += this.name + '=' + encodeURIComponent(this.value);
        })

        if ($(".checkout_info").length>0) {
            var order = "";
            $('.checkout_info .order .items .product').each(function(i, elem) {
                var order2 = $(elem).find(".name").text().trim() + " \t\t";
                order2 += $(elem).find(".amount").text() + " ";
                //order2 += " x " + $(elem).find(".amount input").val();
                order2 += " = " + $(elem).find(".price").text();
                order2 += "(" + $(elem).find(".features").text() + ")";
                order += order2.replace(/\r|\n/g, '') + "\n";
            });

            order += "\n" + $(".total_price").text().trim() + "\n";
            dataForAjax += '&order=' + encodeURIComponent(order);

            dataForAjax += '&type=' + encodeURIComponent($("input[name='type']:checked").val());
            dataForAjax += '&delivery_method=' + encodeURIComponent($("input[name='delivery_method']:checked").val());
            dataForAjax += '&payment_method=' + encodeURIComponent($("input[name='payment_method']:checked").val());
        }       

        if (!valid) {
            return false;
        }  

        $.ajax({
            type: 'POST',
            data: dataForAjax,
            url: addressForAjax,
            success: function(response) {
                $("form").trigger("reset");
                $.removeCookie('products');
                window.location.href = 'http://taktilpro.ru/spasibo/';
                
            } 
        });
    }); 

    $('.js-form2 button').on('click', function(event){
        event.preventDefault();
        var dataForAjax = "action=form&";
        var addressForAjax = myajax.url;
        var valid = true;
        
        $(this).closest('form').find('input:not([type=submit]),textarea, select').each(function(i, elem) {
            if (this.value.length < 3 && $(this).hasClass('required')) {
                valid = false;
                $(this).addClass('error');
            }
            if ($(this).attr('name') == 'email' && $(this).hasClass('required')) {
                var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
                if (!pattern.test($(this).val())) {
                    valid = false;
                    $(this).addClass('error');
                }
            }
            if ($(this).attr('name') == 'agree' && !$(this).prop("checked")) {
                $(this).addClass('error');
                valid = false;
            }

            if($(this).attr('name') == 'phone' && $(this).hasClass('required')) {
                console.log(this.value.replace(/[_-]/g, '').length);
                if (this.value.replace(/[_-]/g, '').length!=16)
                {
                    valid = false;
                    $(this).addClass('error');
                }
            } 

            if (i > 0) {
                dataForAjax += '&';
            }
            dataForAjax += this.name + '=' + encodeURIComponent(this.value);
        })      

        if (!valid) {
            return false;
        }  

        $.ajax({
            type: 'POST',
            data: dataForAjax,
            url: addressForAjax,
            success: function(response) {
                $("form").trigger("reset");
                $(".result").show();
                //window.location.href = 'http://localhost/2025/taktil/spasibo/';

                // очистить куки для очистки корзины
                //$.removeCookie('products');
            } 
        });
    }); 


	// поиск цены 
	if($(".product_info").length>0)
	{
		let material = $('input[name="material"]:checked').data("id");
		let size = $('input[name="size"]:checked').data("id");
		const price = findPrice(material, size);
		$(".product_info .price").text(new Intl.NumberFormat('ru-RU').format(price)+" ₽").css('visibility', 'visible');
	}

	$('body').on('change', 'input[name="material"], input[name="size"]', function (e) {
		e.preventDefault()
		let material = $('input[name="material"]:checked').data("id");
		let size = $('input[name="size"]:checked').data("id");

		const price = findPrice(material, size);
		$(".product_info .price").text(new Intl.NumberFormat('ru-RU').format(price)+" ₽");

		/*$('.product_info .buy_btn').show();
		$('.product_info .amount').removeClass('show');*/
		$('.product_info .buy_btn').text("Добавить в корзину")
	})

	// добавление в корзину 

	$(".buy_btn").on('click', function(e) {
        e.preventDefault();        

        $('.product_info .buy_btn').text("В корзине")

        id = $(this).data("id");
        material = $('input[name="material"]:checked').data("id");
        size = $('input[name="size"]:checked').data("id");
        color = $('input[name="color"]:checked').data("id");
        counts = 1;       
        var product = {
            'id': id,
            'counts': counts,
            'material': material,
            'size': size,
            'color': color                         
        };

        iterator = true;

        if ($.cookie('products')) {
            var products = JSON.parse($.cookie('products'));            
            products.forEach(function(item, i, products) {
                if (item.id == product.id && item.material == product.material && item.size == product.size && item.color == product.color) {
                    item.counts++;
                    iterator = false;
                }
            });
            if (iterator) {
                products.push(product);
            }
            var json_products = JSON.stringify(products);
            $.cookie('products', json_products, { expires: 360, path: '/' });
        } else {
            var products = [];
            products.push(product);
            var json_products = JSON.stringify(products);
            $.cookie('products', json_products, { expires: 360, path: '/' });
        }    

        $(".js-count-cart").text(Number(products.length));    

    });

    // минусуем
    $('body').on("click", '.js-minus', function(e) {   
        var product = $(this).closest(".product");
    	var sum = $(product).find(".total span");

        var $input = $(this).next();
        var count = parseInt($input.val()); 

        var total = 0;  

        id = $(this).closest(".product").data("id");  
        material = $(this).closest(".product").data("material"); 
        size = $(this).closest(".product").data("size"); 
        color = $(this).closest(".product").data("color"); 
        price = $(this).closest(".product").data("price"); 
        
        if(count!=1)
        {            
            if ($.cookie('products')) {
                var products = JSON.parse($.cookie('products'));
                products.forEach(function(item, i, products) {
                    if (item.id == id && item.material == material && item.size == size && item.color == color) {
                        item.counts--;
                        iterator = false;
                    }
                });
                var json_products = JSON.stringify(products);
                $.cookie('products', json_products, { expires: 360, path: '/' });
                //count--;
            }
        } 
        else
        {
            if ($.cookie('products')) {
                var products = JSON.parse($.cookie('products'));
                products.forEach(function(item, i, products) {
                    if (item.id == id && item.material == material && item.size == size && item.color == color) {
                        item.counts=1;
                        iterator = false;
                    }
                });
                var json_products = JSON.stringify(products);
                $.cookie('products', json_products, { expires: 360, path: '/' });
            }
        }
        
        $(sum).html(new Intl.NumberFormat('ru-RU').format(count*price));  

        $(".total span").each(function( index ) {
            total = total + Number($(this).text().replace(/\s+/g, ""));
        });  

        $(".total_price span").text(new Intl.NumberFormat('ru-RU').format(total));

    });

    $('body').on("click", '.js-plus', function(e) {  
    	var product = $(this).closest(".product");
    	var sum = $(product).find(".total span");

        var $input = $(this).prev();
        var count = parseInt($input.val()); 

        var total = 0;  

        id = $(this).closest(".product").data("id");  
        material = $(this).closest(".product").data("material"); 
        size = $(this).closest(".product").data("size"); 
        color = $(this).closest(".product").data("color"); 
        price = $(this).closest(".product").data("price"); 
       
        if ($.cookie('products')) {
            var products = JSON.parse($.cookie('products'));
            products.forEach(function(item, i, products) {
                if (item.id == id && item.material == material && item.size == size && item.color == color) {
                    item.counts++;
                    iterator = false;
                }
            });
            //count++;
            var json_products = JSON.stringify(products);
            $.cookie('products', json_products, { expires: 360, path: '/' });
        }

        $(sum).html(new Intl.NumberFormat('ru-RU').format(count*price));  

        $(".total span").each(function( index ) {
            total = total + Number($(this).text().replace(/\s+/g, ""));
        });  

        $(".total_price span").text(new Intl.NumberFormat('ru-RU').format(total));  
    });

    $('body').on("change", '.amount input', function(e) { 
    	var product = $(this).closest(".product");
    	var sum = $(product).find(".total span");
       
        var $input = $(this);
        var count = parseInt($input.val());

        var total = 0;  

        id = $(this).closest(".product").data("id");  
        material = $(this).closest(".product").data("material"); 
        size = $(this).closest(".product").data("size"); 
        color = $(this).closest(".product").data("color"); 
        price = $(this).closest(".product").data("price"); 

        if ($.cookie('products')) {
            var products = JSON.parse($.cookie('products'));
            products.forEach(function(item, i, products) {
                if (item.id == id && item.material == material && item.size == size && item.color == color) {
                    item.counts = count;
                    iterator = false;
                }
            });
            var json_products = JSON.stringify(products);
            $.cookie('products', json_products, { expires: 360, path: '/' });
        }
        
        $(sum).html(new Intl.NumberFormat('ru-RU').format(count*price));  

        $(".total span").each(function( index ) {
            total = total + Number($(this).text().replace(/\s+/g, ""));
        });  

        $(".total_price span").text(new Intl.NumberFormat('ru-RU').format(total)); 

        return false;
    });

    $('body').on("click", '.delete', function(e) {
        id = $(this).closest(".product").data("id");  
        material = $(this).closest(".product").data("material"); 
        size = $(this).closest(".product").data("size"); 
        color = $(this).closest(".product").data("color"); 
        price = $(this).closest(".product").data("price"); 

        var total = 0; 

        if ($.cookie('products')) {
            var products = JSON.parse($.cookie('products'));
            products.forEach(function(item, i, products) {
                if (item.id == id && item.material == material && item.size == size && item.color == color) {
                    products.splice(i, 1);
                }
            });
            var json_products = JSON.stringify(products);
            $.cookie('products', json_products, { expires: 360, path: '/' });
        }
        $(this).parent().remove();
       
        $(".total span").each(function( index ) {
            total = total + Number($(this).text().replace(/\s+/g, ""));
        });  

        $(".total_price span").text(new Intl.NumberFormat('ru-RU').format(total)); 
        $(".js-count-cart").text(Number(products.length));

    });
})

function findPrice(material, size) {
	const foundItem = prices.find(item => item.material === material && item.size === size);
	if (foundItem) {
		return foundItem.price;
	} else {
		return "Цена не найдена"; // Или другое значение по умолчанию, если комбинация не найдена
	}
}