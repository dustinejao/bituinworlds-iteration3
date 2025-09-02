jQuery(document).ready(function ($) {
	const $container = $('.greenshift_form__general')

	$container.on('click', '.add-new-font', function (e) {
		e.preventDefault()
		const count = parseInt($("[name=fonts_count]").val()) + 1;

		$.ajax({
			method: "POST",
			url: greenShift_params.ajaxUrl,
			data: { action: 'gspb_settings_add_font', i: count },
		})
			.success(function (data) {
				$container.find('.fonts-wrap').append(data.html)
				$container.find('[name=fonts_count]').val(count)
			})
			.error(function (data) {
				// error
			});
	});

	$container.on('click', '.remove-last-font', function (e) {
		e.preventDefault()
		const count = parseInt($("[name=fonts_count]").val());

		//if (count < 2) return false;

		$container.find('.fonts-wrap .font-item').filter(':last').remove()
		$container.find('[name=fonts_count]').val(count - 1)
	});

	$container.on('click', '.remove-font', function (e) {
		e.preventDefault()
		const count = parseInt($("[name=fonts_count]").val());

		//if (count < 2) return false;

		let index = $(this).index('.remove-font');
		$container.find('.fonts-wrap .font-item').eq(index).remove()
		$container.find('[name=fonts_count]').val(count - 1)
	});

	$container.on('click', '.current-file-actions .remove-font-file', function (e) {
		e.preventDefault();
		const $this = $(this);
		const $td = $this.closest('td');
		$td.find('.current-file-hidden-input').val('');
		$td.find('.current-file').remove();
	});

	$('#delay_js_on').change(function() {
		if(this.checked) {
			$(".delay_js_optionsrow").show();
			var pageoptionvalue = $('#delay_js_page_on').val();
			if(pageoptionvalue == "includefor" || pageoptionvalue == "excludefor") {
			  $(".delay_js_pagerow").show();
			}
		} else {
			$(".delay_js_optionsrow").hide();
			$(".delay_js_pagerow").hide();
		}     
	});
  
	$('#delay_js_page_on').on('change', function() {
		if(this.value == "includefor" || this.value == "excludefor") {
			$(".delay_js_pagerow").show();
		} else {
			$(".delay_js_pagerow").hide();
		}  
	});

})