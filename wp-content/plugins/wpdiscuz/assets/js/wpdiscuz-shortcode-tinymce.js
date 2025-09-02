(function ($) {

    if(typeof wpdObject !== 'undefined'){
        tinymce.create( 'tinymce.plugins.wpDiscuz',{

            init : function (ed, url) {
                // if (ed.id === "content" || ed.id === "main_content_content_vb_tiny_mce") {
                ed.addButton('wpDiscuz', {
                        image: wpdObject.image,
                        tooltip: wpdObject.tooltip,
                        onclick: function () {
                            var w = $(window).width();
                            var dialogWidth = 600;
                            var W = (dialogWidth < w) ? dialogWidth : w;
                            $('#wpd-inline-question').val('');
                            tinymce.activeEditor = ed;
                            var text = tinymce.activeEditor.selection.getContent();
                            $('#wpd-inline-content').html(text ? text : '<span class="wpd-text-error">' + wpdObject.no_text_selected + '</span>');
                            tb_show(wpdObject.popup_title, '#TB_inline?width=' + W + '&height=400&inlineId=wpdiscuz_feedback_dialog');
                        }
                    });
                // }
            },

            getInfo : function(){
                return {
                    longname : 'wpDiscuz',
                    author : 'gVectors Team',
                    authorurl : 'https://gvectors.com/',
                    infourl : 'https://gvectors.com/',
                    version : '1.1'
                };
            }

        });



        /* global tinymce */
        /* global wpdObject */
        tinymce.PluginManager.add('wpDiscuz', tinymce.plugins.wpDiscuz);
    }

    $('body').on('mousedown', '#wpd-put-shortcode', function () {
        var question = $('#wpd-inline-question').val();
        var shortcode = '[' + wpdObject.shortcode + ' id="' + Math.random().toString(36).substr(2, 10) + '" question="' + (question ? $('<div>' + question + '</div>').text() : wpdObject.leave_feebdack) + '" opened="' + $('[name=wpd-inline-type]:checked').val() + '"]';
        shortcode += tinymce.activeEditor.selection.getContent();
        shortcode += '[/' + wpdObject.shortcode + ']';
        tinymce.activeEditor.execCommand('mceInsertContent', 0, shortcode);
        tb_remove();
    });
})(jQuery);
