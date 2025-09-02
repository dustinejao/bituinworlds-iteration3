jQuery(document).ready(function ($) {

    const wpNativeAjax = parseInt(wpdiscuzAjaxObj.isNativeAjaxEnabled, 10);

    $('body').on('click', '#wpdcom .wmu-upload-wrap', function () {
        $('.wpd-form-foot', $(this).parents('.wpd_comm_form')).slideDown(parseInt(wpdiscuzAjaxObj.enableDropAnimation) ? 500 : 0);
    });

    $(document).delegate('.wmu-add-files', 'change', function () {
        const btn = $(this);
        const form = btn.closest('.wpd_comm_form');
        const files = btn[0].files ? btn[0].files : [];
        if (files.length) {
            $('.wmu-action-wrap .wmu-tabs', form).html('');
            $.each(files, function (key, file) {
                let mimeType = file.type;
                let previewArgs = {
                    'id': '',
                    'icon': '',
                    'fullname': file.name,
                    'shortname': getShortname(file.name),
                    'type': '',
                };

                if (mimeType.match(/^image/)) {
                    previewArgs.type = 'images';
                    if (window.FileReader) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            previewArgs.icon = this.result;
                            previewArgs.shortname = '';
                            initPreview(form, previewArgs);
                        }
                    }
                } else if (mimeType.match(/^video/) || mimeType.match(/^audio/)) {
                    previewArgs.type = 'videos';
                    previewArgs.icon = wpdiscuzAjaxObj.wmuIconVideo;
                    initPreview(form, previewArgs);
                } else {
                    previewArgs.type = 'files';
                    previewArgs.icon = wpdiscuzAjaxObj.wmuIconFile;
                    initPreview(form, previewArgs);
                }
            });
        } else {
            return;
        }
    });

    /**
     * @param form
     * @param args
     */
    function initPreview(form, args = {}) {
        console.log('init: ' + JSON.stringify(args));
        let previewTemplate = wpdiscuzAjaxObj.previewTemplate;
        previewTemplate = previewTemplate.replace('[PREVIEW_TYPE_CLASS]', 'wmu-preview-' + args.type);
        previewTemplate = previewTemplate.replace('[PREVIEW_TITLE]', args.fullname);
        previewTemplate = previewTemplate.replace('[PREVIEW_TYPE]', args.type);
        previewTemplate = previewTemplate.replace('[PREVIEW_ID]', args.id);
        previewTemplate = previewTemplate.replace('[PREVIEW_ICON]', args.icon);
        previewTemplate = previewTemplate.replace('[PREVIEW_FILENAME]', args.shortname);
        $('.wmu-action-wrap .wmu-' + args.type + '-tab', form).removeClass('wmu-hide').append(previewTemplate);
    }

    function getShortname(str) {
        let shortname = str;
        if ((typeof str !== 'undefined') && str.length) {
            if (str.length > 40) {
                shortname = str.substring(str.length - 40);
                shortname = "..." + shortname;
            }
        }
        return shortname;
    }

    $('body').on('click', '.wmu-attachment-delete', function (e) {
        if (confirm(wpdiscuzAjaxObj.wmuPhraseConfirmDelete)) {
            const btn = $(this);
            const attachmentId = btn.data('wmu-attachment');
            const data = new FormData();
            data.append('action', 'wmuDeleteAttachment');
            data.append('attachmentId', attachmentId);
            wpdiscuzAjaxObj.getAjaxObj(wpNativeAjax, true, data)
                .done(function (r) {
                    if (r.success) {
                        var parent = btn.parents('.wmu-comment-attachments');
                        btn.parent('.wmu-attachment').remove();
                        if (!$('.wmu-attached-images *', parent).length) {
                            $('.wmu-attached-images', parent).remove();
                        }
                        if (!$('.wmu-attached-videos *', parent).length) {
                            $('.wmu-attached-videos', parent).remove();
                        }
                        if (!$('.wmu-attached-files *', parent).length) {
                            $('.wmu-attached-files', parent).remove();
                        }
                    } else {
                        if (r.data.errorCode) {
                            wpdiscuzAjaxObj.setCommentMessage(wpdiscuzAjaxObj.applyFilterOnPhrase(wpdiscuzAjaxObj[r.data.errorCode], r.data.errorCode, parent), 'error', 3000);
                        } else if (r.data.error) {
                            wpdiscuzAjaxObj.setCommentMessage(r.data.error, 'error', 3000);
                        }
                    }
                    $('#wpdiscuz-loading-bar').fadeOut(250);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    $('#wpdiscuz-loading-bar').fadeOut(250);
                });
        } else {
            console.log('canceled');
        }
    });

    if (parseInt(wpdiscuzAjaxObj.wmuIsLightbox)) {
        function wmuAddLightBox() {
            $(".wmu-lightbox").colorbox({
                maxHeight: "95%",
                maxWidth: "95%",
                rel: 'wmu-lightbox',
                fixed: true
            });
        }

        wmuAddLightBox();
        wpdiscuzAjaxObj.wmuAddLightBox = wmuAddLightBox;
    }

    wpdiscuzAjaxObj.wmuHideAll = function (r, wcForm) {
        if (typeof r === 'object') {
            if (r.success) {
                $('.wmu-tabs', wcForm).addClass('wmu-hide');
                $('.wmu-preview', wcForm).remove();
                $('.wmu-attached-data-info', wcForm).remove();
            } else {
                console.log(r.data);
            }
        } else {
            console.log(r);
        }
    }

});