$.fn.colorpicker = function () {
    'use strict';

    const CONST = {
        pixelDataCount: 4,
        neededPixelCount: 3,
        initialColor: 'white',
        paletteImgSrc: './imgs/color-picker.png',
        iconImgSrc: './imgs/icon.jpg'
    };

    Object.freeze(CONST);

    function decToHex(dec) {
        const hexC = dec.toString(16);
        return (hexC.length === 1) ? '0' + hexC : hexC;
    }

    const $this = $(this),
        showBtn = $('<span />').addClass('show-btn open').appendTo($this),
        colorpicker = $('<div />', { 'id': 'color-picker-div', 'class': 'picker-hidden' }).appendTo($this),
        palette = $('<canvas />').appendTo(colorpicker),
        colors = $('<div />').addClass('colors').appendTo(colorpicker),
        hex = $('<input />', { 'type': 'text', 'placeholder': 'HEX' }).appendTo(colors),
        rgb = $('<input />', { 'type': 'text', 'placeholder': 'RGB' }).appendTo(colors),
        colorDiv = $('<div />').addClass('color-viz').appendTo(colorpicker),
        ctx = palette.get(0).getContext('2d'),
        img = new Image(),
        canvas = palette.get(0);

    img.src = CONST.paletteImgSrc;
    img.crossOrigin = 'Anonymous';

    showBtn.on('click', function () {
        colorpicker.toggleClass('picker-hidden');
        showBtn.toggleClass('close');
        showBtn.toggleClass('open');
    });

    let imgData;

    $(img).on('load', function () {

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        imgData = ctx.getImageData(0, 0, img.width, img.height).data;

        colorDiv.css('background-color', CONST.initialColor);
    });

    palette.on('click', function (ev) {
        
        const x = (ev.clientX - palette.offset().left | 0) * CONST.pixelDataCount,
            y = (ev.clientY - palette.offset().top | 0) * CONST.pixelDataCount * this.width,
            pixel = [].slice.call(imgData, x + y, x + y + CONST.neededPixelCount),
            rgbColor = pixel.join(','),
            hexColor = '#' + pixel.map(decToHex).join('');

        rgb.val(rgbColor);
        hex.val(hexColor);

        colorDiv.css('background-color', hexColor);

        try {
            hex.select();
            document.execCommand('copy');
            hex.blur();
        } catch (err) {

        }
    });

    return $(this);
}