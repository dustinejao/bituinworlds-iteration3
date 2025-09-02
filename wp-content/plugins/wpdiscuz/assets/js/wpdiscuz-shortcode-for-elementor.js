jQuery(document).ready(function ($) {

    top.window.elementor.hooks.addAction('panel/open_editor/widget/text-editor', function (panel, model, view) {

        let intervalID = setInterval(() => {
            if (top.window.tinymce.activeEditor !== null) {
                clearInterval(intervalID);
                let editor = top.window.tinymce.activeEditor;
                let selectedText = '';

                editor.addButton('wpdiscuz', {
                    image: wpdObjectEl.image,
                    tooltip: wpdObjectEl.tooltip,
                    onclick: () => {
                        var w = $(window).width();
                        var dialogWidth = 600;
                        var W = (dialogWidth < w) ? dialogWidth : w;
                        $('#wpd-inline-question').val('');
                        selectedText = editor.selection.getContent();
                        $('#wpd-inline-content').html(selectedText ? selectedText : '<span class="wpd-text-error">' + wpdObjectEl.no_text_selected + '</span>');
                        tb_show(wpdObjectEl.popup_title, '#TB_inline?width=' + W + '&height=400&inlineId=wpdiscuz_feedback_dialog');
                    }
                });

                $('#wpd-put-shortcode').on('click', () => {
                    var question = $('#wpd-inline-question').val();
                    var shortcode = '[' + wpdObjectEl.shortcode + ' id="' + Math.random().toString(36).substr(2, 10) + '" question="' + (question ? $('<div>' + question + '</div>').text() : wpdObjectEl.leave_feebdack) + '" opened="' + $('[name=wpd-inline-type]:checked').val() + '"]';
                    shortcode += selectedText;
                    shortcode += '[/' + wpdObjectEl.shortcode + ']';

                    editor.execCommand('mceInsertContent', 0, shortcode);
                    tb_remove();

                });

                let button = editor.buttons['wpdiscuz'];
                let bg = editor.theme.panel.find('toolbar buttongroup')[0];
                bg._lastRepaintRect = bg._layoutRect;
                bg.append(button);
            }
        }, 200);

    });
});