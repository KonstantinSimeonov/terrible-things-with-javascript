$.fn.lists = function (lists) {

    var $this = $(this),
        $listsWrapper = $('<section />').addClass('lists-wrapper');
    
    var dragged;

    lists.forEach(function (list) {
        var $listArticle = $('<article />').addClass('items-section').appendTo($listsWrapper),
            $header = $('<strong />').text(list[0]).appendTo($listArticle),
            $add = $('<div />').addClass('add-item-wrapper').appendTo($listArticle),
            $addBtn = $('<a />').addClass('add-btn visible').appendTo($add),
            $addInput = $('<input />', { type: 'text' }).addClass('add-input').appendTo($add),
            $list = $('<ul />').appendTo($listArticle);
            
        for (var i = 1, len = list.length; i < len; i += 1) {
            $('<li />', { draggable: true })
                .append($('<a />', { target: '_blank', href: 'https://www.google.com/search?q=' + list[i] }).text(list[i]))
                .appendTo($list);
        }

        $addBtn.on('click', function (ev) {
            ev.preventDefault();
            $addInput.addClass('visible');
            $(this).removeClass('visible');
        });

        $addInput.on('keyup', function (ev) {
            var enterKeyCode = 13;
            if(ev.keyCode === enterKeyCode) {
                $addBtn.addClass('visible');

                var $this = $(this);
                $this.removeClass('visible');

                $('<li />', { draggable: true })
                    .append($('<a />', { target: '_blank', href: 'https://www.google.com/search?q=' + $this.val() }).text($this.val()))
                    .appendTo($list);

                $this.val('');
            }
        });

        $listArticle.on('dragstart', function (ev) {

            if(!(ev.target instanceof HTMLLIElement)) {
                dragged = $(ev.target).parents('li').get(0);
                return;
            }
            
            dragged = ev.target;
        });

        $listArticle.on('dragover', function (ev) {
            ev.preventDefault();
        });

        $listArticle.on('drop', function (ev) {
            ev.preventDefault();
            var $this = $(this),
                $list = $this.children('ul').get(0);
                console.log(dragged);
            $list.appendChild(dragged);
        });
    });
    
    $listsWrapper.appendTo($this);

    return $this;
}