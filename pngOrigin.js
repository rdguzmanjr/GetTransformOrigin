let getOrigin={ 
    imgArr:[],
    g:function(clas, setO = "center",insideFlex=true) {
    if(typeof clas== 'undefined')return "";
    if (typeof(clas) == "string") {
        clas = document.querySelector(clas);
    } else {
        clas = clas;
    }
    let style = clas.currentStyle || window.getComputedStyle(clas, false),
        imgsource = style.backgroundImage.slice(4, -1).replace(/"/g, ""),
        img = this.getImage(imgsource.match(/^.*\/([^/]+\.[^/.]+)$/)[1]),
        originX, originY, pixels, l, bound, x, y;

    c = document.createElement('canvas');
    ctx = c.getContext("2d", {willReadFrequently: true, });
    c.width = img.width;
    c.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx = c.getContext('2d', {willReadFrequently: true,});
    pixels = ctx.getImageData(0, 0, c.width, c.height); //error
    l = pixels.data.length;
    bound = {
        top: null,
        left: null,
        right: null,
        bottom: null
    };
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    } //default is center, "tr", "tm", "tl", "rm", lm", "br", "bm" , "bl";
    switch (setO) {
        case "tl":
        originX = this.avg(bound.left,c.width);
        originY = this.avg(bound.top,c.height);
        break;
        case "tr":
        originX = this.avg(bound.right,c.width);
        originY = this.avg(bound.top,c.height);
        break;
        case "br":
        originX = this.avg(bound.right,c.width);
        originY = this.avg(bound.bottom,c.height);
        break;
        case "bl":
        originX = this.avg(bound.left,c.width);
        originY = this.avg(bound.bottom,c.height);
        break;
        case "tm":
        originX = this.mid(bound.right,bound.left,c.width);
        originY = this.avg(bound.top,c.height);
        break;
        case "bm":
        originX = this.mid(bound.right,bound.left,c.width);
        originY = this.avg(bound.bottom,c.height);
        break;
        case "rm":
        originX = this.avg(bound.right,c.width);
        originY = this.mid(bound.bottom,bound.top,c.height);
        break;
        case "lm":
        originX = this.avg(bound.left,c.width);
        originY = this.mid(bound.bottom,bound.top,c.height);
        break;
        default:
        originX = this.mid(bound.right,bound.left,c.width);
        originY = this.mid(bound.bottom,bound.top,c.height);
        }
        if(!insideFlex){
            let flexw=gsap.getProperty('.flex', "width");
            let contw=gsap.getProperty('.container', "width");
            let flexh=gsap.getProperty('.flex', "height");
            let conth=gsap.getProperty('.container', "height");
            if(contw>flexw)
            originX = ((flexw * originX / 100 + (contw - flexw) / 2) / contw)*100;
            if(conth>flexh)
            originY = ((flexh * originY / 100 + (conth - flexh) / 2) / conth)*100;
        }
    return originX.toFixed(1) + "% " + originY.toFixed(1) + "%";
},
avg:function(x,y) {
    return (x/y)*100;
},
mid:function(x,y,z){
    return (((x+y)/2)/z)*100;
},
getImage:function(src) {
    let len=this.imgArr.length;
    for (let i = 0; i < len; i++) {
        if (this.imgArr[i].fsrc === src) {
            return this.imgArr[i].elm;
            break;
        }
    }
} ,
p:function(ielem,fname){
    this.imgArr.push({elm:ielem,fsrc:fname.match(/^.*\/([^/]+\.[^/.]+)$/)[1]})
}
} 