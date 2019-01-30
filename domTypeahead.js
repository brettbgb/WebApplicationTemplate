// domTypeahead.js
//
// Author: DOM IT
// Dependencies: JQuery and Handlebars
//
(function ($, handlebars) {
    $.fn.domTypeahead = function (options) {

        var self = $(this);
        var settings = $.extend({
            // currently the only options are the controller method path
            controller: userApiPath
        }, options);

        this.keyup(function () {
            if ($(this).val().length > 0) {

                var searchString = self.val();
                // call ajax with search string
                $.ajax({
                    method: "GET",
                    url: settings.controller,
                    data: { 'searchString': searchString }

                }).done(function (data) {

                    // re-build html with data
                    var dropList = $("#" + self.attr('id') + "_dl");
                    if (dropList.length > 0) {
                        //delete existing
                        dropList.remove();
                    }
                    // create new list
                    if (data.length > 0) {
                        addList(data, self);
                    }

                })
            }
        })

        /* Add dropdown list of items based on search results */
        function addList(data, $textBox) {

            var $templateList = $('<ul class="typeahead dropdown-menu" role="listbox" style="top: 70px; left: 15px; display: block;"></ul>');
            $templateList.attr('id', $textBox.attr('id') + "_dl");
            for (var i = 0; i < data.length; i++) {
                var templateItem = handlebars.compile($('.search-item-template').html());

                $templateList.append($(templateItem({ name: data[i] })))
            }

            $textBox.after($templateList);

            $templateList.find('a').click(function () {
                $textBox.val($(this).html());
                $('#' + $textBox.attr('id') + "_dl").remove();
            });

            $('body').click(function () {
                $('#' + $textBox.attr('id') + "_dl").remove();
            });
        }

        return this;
    };


})(jQuery, Handlebars);
