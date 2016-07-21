$.fn.tabs = function (tabInfo) {
    var $this = $(this),
        tabsSection = $('<section />', { 'class': 'tabs-section' }),
        nav = $('<nav />').addClass('tabs-nav').appendTo(tabsSection),
        navUl = $('<ul />').appendTo(nav),
        tabsList = $('<ul />', { 'class': 'tabs-list' }).appendTo(tabsSection);

    var i,
        selected,
        active;

    function createTab(tab, i) {
        var navItem = $('<li />')
                        .addClass('nav-item')
                        .attr('target-tab', i)
                        .append($('<a />', { 'href': '#' }).text(tab.title))
                        .appendTo(navUl);
        
        navItem.on('click', onTabClick);

        var tabItem = $('<li />', { 'class': 'tab-item', 'tab-index': i }),
            tabHeader = $('<header />').addClass('tab-header').append($('<h2>' + tab.title + '</h2>')).appendTo(tabItem),
            tabContent = $('<article />').addClass('tab-content').text(tab.content).appendTo(tabItem);

        if(i === 0) {
            selected = navItem;
            active = tabItem;
            tabItem.addClass('active');
            navItem.addClass('selected');
        }
        
        return {
            navItem: navItem,
            tabItem: tabItem
        };
    }

    function onTabClick() {
        var $target = $(this),
            tabIndex = $target.attr('target-tab');

        selected.removeClass('selected');
        active.removeClass('active');
               

        selected = $target;
        active = $('li[tab-index=' + tabIndex + ']');

        $target.addClass('selected');
        active.addClass('active');
    }

    tabInfo.forEach(function (tab, i) {
        var elements = createTab(tab, i);

        elements.navItem.appendTo(navUl);
        elements.tabItem.appendTo(tabsList);
    });

    var addTab = $('<li />', { 'class': 'add-tab', 'target-tab': -1 }).append($('<a href="#">+</a>')).appendTo(navUl),
        addTabBody = $('<li />', { 'class': 'tab-item', 'tab-index': -1 }).addClass('tab-item').appendTo(tabsList),
        addTabHeader = $('<header />').append($('<h2>New tab</h2>')).appendTo(addTabBody),
        formContainer = $('<article />').addClass('tab-content').appendTo(addTabBody),
        addTabForm = $('<form />').appendTo(formContainer),
        formTitle = $('<input />', { 'type': 'text', 'name': 'new-tab-title', 'class': 'text-input' }).appendTo(addTabForm),
        formContent = $('<textarea />', { 'type': 'text', 'name': 'new-tab-content', 'class': 'text-input' }).appendTo(addTabForm),
        create = $('<input />', { 'type': 'button', 'class': 'add-btn', 'value': 'Create' }).appendTo(addTabForm);

    addTab.on('click', onTabClick);

    create.on('click', function () {
        var newTabInfo = {
            title: formTitle.val(),
            content: formContent.val()
        };

        var newElements = createTab(newTabInfo, tabsList.children().length - 1);

        newElements.navItem.insertBefore(addTab);
        newElements.tabItem.appendTo(tabsList);
    });

    $this.append(tabsSection);

    return $this;
}