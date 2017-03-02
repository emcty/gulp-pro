let GLOBAL_CONFIG = window.__GLOBAL_CONFIG__;
let ImageTextInfo = {};
ImageTextInfo.yndCertTitle = "宜农贷爱心证书";
ImageTextInfo.certifiNo = "NO.YND" + GLOBAL_CONFIG.certifiNo;
ImageTextInfo.yndTrace = "爱心足迹";
ImageTextInfo.honoraryTitle = "特殊荣誉称号：";
ImageTextInfo.yndAppellation = `亲爱的${GLOBAL_CONFIG.realName} ，您好：`;
if (+GLOBAL_CONFIG.level <= 3) {
  ImageTextInfo.firstYndContent = `${GLOBAL_CONFIG.joinTime}宜农贷与您初相遇，${GLOBAL_CONFIG.currentYear}年度您的爱`;
  ImageTextInfo.secondYndContent = `心指数已达 ${GLOBAL_CONFIG.caringValue} ，位于爱心排行榜 ${GLOBAL_CONFIG.caringRank} 位。`;
  ImageTextInfo.othefYndContent = "感谢您与宜农贷一路同行！";
} else if (+GLOBAL_CONFIG.level > 3 && (+GLOBAL_CONFIG.level <= 6)) {
  ImageTextInfo.firstYndContent = `宜农贷有幸于${GLOBAL_CONFIG.joinTime}与您相遇相知，${GLOBAL_CONFIG.currentYear}年`;
  ImageTextInfo.secondYndContent = `度您的爱心指数已达 ${GLOBAL_CONFIG.caringValue} ，位于爱心排行榜 ${GLOBAL_CONFIG.caringRank} 位。`;
  ImageTextInfo.othefYndContent = "感谢您一路对宜农贷的支持！";
} else if (+GLOBAL_CONFIG.level > 6 && (+GLOBAL_CONFIG.level <= 10)) {
  ImageTextInfo.firstYndContent = `宜农贷有幸于${GLOBAL_CONFIG.joinTime}与您相遇相知，${GLOBAL_CONFIG.currentYear}年`;
  ImageTextInfo.secondYndContent = `度您的爱心指数已达 ${GLOBAL_CONFIG.caringValue} ，位于爱心排行榜 ${GLOBAL_CONFIG.caringRank} 位。`;
  ImageTextInfo.othefYndContent = "感恩有您，宜路相伴！";
}
ImageTextInfo.bcAddress = `区块链地址：${GLOBAL_CONFIG.userAddress}`;

// flag "1"表示需要重新生成图片 "0"表示不需重新生成
let ajaxPost = (imageParam, flag = "1") => {
  let imageArrTmp = imageParam.split("base64,");
  return new Promise((resolve, reject) => {
    $.ajax({
      "url": " /helpFarmer/upLoadCertifi",
      "method": "POST",
      "data": {
        "pic": imageArrTmp[1],
        flag: flag
      }
    }).done((ret) => {
      if (typeof ret === 'string') {
        ret = JSON.parse(ret);
      }
      if (ret.status == '0') {
        let data = ret.data;
        let urlImg = data.url;
        resolve(urlImg);
      }
      reject('服务器内部错误，请联系管理员');
    }).fail(() => {
      reject('服务器内部错误，请联系管理员');
    });
  });
};

const certInfo = {
  pageSize: 20,
  page: 1,
  imageCanvas: "",
  shareImgUrl: "",
  mapChart: "",
  dialog:false,
  realNameValidatorDailog:"",
  dom: {
    downBtn: $("#downBtn"),
    mapArea: $("#map"),
    yndNo: $("#yndNo"),
    yndAppellation: $("#yndAppellation"),
    yndContent: $("#yndContent"),
    honoraryTitle: $("#honoraryTitle"),
    honoraryIcon: $("#honoraryIcon"),
    bcAddress: $("#bcAddress"),
    certDate: $("#certDate"),
    sealIcon: $("#sealIcon"),
    certBjDown: $("#certBjDown"),
    shareBtn: $("#shareBtn"),
    shareArea: $("#shareArea"),
    mask: $("#mask"),
    popWin: $("#popWin"),
    closeWin: $("#closeWin"),
    helpIcon: $(".icon-time"),
    helpInfo: $(".bubble"),
    yndCertTitle: $("#yndCertTitle"),
    yndOtherContent: $("#yndOtherContent"),
    loveFootPrint: $("#loveFootPrint"),
    certArea: $("#certArea"),
    moreBtn: $(".more-btn"),
    recordTable: $("#recordTable"),
    textFill: $(".text-fill"),
    loading: $(".loading"),
    yndLogo: $(".ynd-logoCert"),
    form: $("#form"),
    errorTips: $(".errorTips_idCardBind"),
    realName: $("#realName_fastHelpFarmerValidateBind"),
    idCard: $("#idCard_fastHelpFarmerValidateBind")
  },
  initEvent() {
    //实名验证
    $("body").on("click",".validator",(e)=>{
      let $this=$(e.target);
      this.validate_idCardBind_fastHelpFarmerValidateBind($this);
    })
    .on("click","#sureBtn",()=>{ 
      this.realNameValidatorDailog.close().remove();
      this.dialog=false;
      location.reload();
    });
    // 下载按钮
    this.dom.downBtn.on("click", (event) => {
      event.preventDefault();
      this.showDialog();
      if(this.dialog)return;
      if (!certInfo.imageCanvas) {
        if (typeof document.createElement('canvas').getContext === 'function') {
          let $canvas = $("<canvas></canvas>").attr({
            height: 551,
            width: 1001
          });
          $canvas.appendTo($("body"));
          let canvas = $canvas[0];
          let context = canvas.getContext("2d");
          let pCanvas = this.drawCanvas(context, canvas);
          pCanvas.then((canvas) => {
            let image = canvas.toDataURL("image/jpg");
            certInfo.imageCanvas = image;
            //window.open(certInfo.imageCanvas);
            let imageArrTmp = image.split("base64,");
            $canvas.remove();
            this.downloadImage(imageArrTmp[1]);
          });
        } else {
          // 不支持canvas
          this.dom.mask.show();
          this.dom.popWin.show();
        }

      } else {
        //window.open(certInfo.imageCanvas);
        let imageArrTmpHave = certInfo.imageCanvas.split("base64,");
        this.downloadImage(imageArrTmpHave[1]);
      }

    });

    // 分享按钮
    this.dom.shareBtn.click((event) => {
      event.stopPropagation();
      this.showDialog();
      if(this.dialog)return;
      // 如果缓存中没有imageCanvas且非IE8浏览器
      if (!certInfo.imageCanvas && (typeof document.createElement('canvas').getContext === 'function')) {
        this.dom.loading.show();
        let $canvas = $("<canvas></canvas>").attr({
          height: 551,
          width: 1001
        });
        $canvas.appendTo($("body"));
        let canvas = $canvas[0];
        let context = canvas.getContext("2d");
        // 生成图片
        let pCanvas = certInfo.drawCanvas(context, canvas);
        pCanvas.then((canvas) => {
          let image = canvas.toDataURL("image/jpg");
          certInfo.imageCanvas = image;
          $canvas.remove();
          // 上传base64图片获得微博、人人图片地址
          ajaxPost(certInfo.imageCanvas, "1").then((urlImg) => {
            certInfo.shareImgUrl = urlImg;
            this.dom.loading.hide();
            this.dom.shareArea.stop().fadeIn(400).find(".old-share").css("background", "#8ec31f");
          }, (msg) => {
            this.dom.loading.hide();
            alert(msg);
          });
        });
      } else {
        // 如果分享图片地址未获得
        if (!certInfo.shareImgUrl) {
          // 如果是由于下载已经缓存中已经存在微博、人人图片地址
          if (certInfo.imageCanvas) {
            this.dom.loading.show();
            ajaxPost(certInfo.imageCanvas, "0").then((urlImg) => {
              certInfo.shareImgUrl = urlImg;
              this.dom.loading.hide();
              this.dom.shareArea.stop().fadeIn(400).find(".old-share").css("background", "#8ec31f");
            }, (msg) => {
              this.dom.loading.hide();
              alert(msg);
            });
          } else {
            // ie8时也需要打开分享下拉
            this.dom.shareArea.stop().fadeIn(400).find(".old-share").css("background", "#8ec31f");
          }
        } else {
          // 若已经存在分享图片的地址，则直接显示分享下拉
          this.dom.shareArea.stop().fadeIn(400).find(".old-share").css("background", "#8ec31f");
        }
      }

    });
    this.dom.shareArea.find(".old-share").hover(() => {
      this.dom.shareArea.find(".old-share").css("background", "#8ec31f");
    }, () => {
      this.dom.shareArea.find(".old-share").css("background", "#9ddb1a");
    });
    // 若分享未隐藏 隐藏分享下拉
    $(document).on("click", (event) => {
      let element = event.target;
      //console.log(element);
      if (!(element && ($(element).parents(".share-area")[0]))) {
        this.dom.shareArea.stop().fadeOut(400);
      }
    });
    // 关闭不支持canvas弹窗
    this.dom.closeWin.on("click", () => {
      this.dom.mask.hide();
      this.dom.popWin.hide();
    });
    // 悬浮帮助信息
    this.dom.helpIcon.on("mouseover", function() {
      $(this).siblings(".bubble").show();
    });
    $(document).on("mouseover", (event) => {
      let elem = event.target;
      if (elem) {
        if ($(elem).parents(".help-info")[0]) {
          return;
        }
      }
      this.dom.helpInfo.hide();
    });
    // 加载更多
    this.dom.moreBtn.on("click", (event) => {
      event.preventDefault();
      this.page = this.page + 1;
      this.getHistory();
    });
  },
  showDialog(){
    this.dom.form.find(".validator").removeAttr("disabled");
    if (GLOBAL_CONFIG.isBindIdCard=="0") { //未实名去实名
      this.realNameValidatorDailog= new dialog({
        width:'600',
        height:'240',
        title: '实名认证',
        content: this.dom.form,
        skin: 'realNameDailog'
      }).showModal();
      this.dialog=true;
    }
  },
  /* 显示错误提示 */
  showWrongMsg($dom,msg) {
    let $wrong = $("<span class='wrong tc ml0'>" + msg + "</span>");
    $dom.prev().removeClass("mb10").closest(".control_group").removeClass("mb10");
    $dom.children().remove().end().append($wrong);
  },
  /* 移除正确或错误提示 */
  removeMsg($dom) {
    $dom.prev().addClass("mb10");
    $dom.closest(".control_group").addClass("mb10");
    $dom.children().remove();
  },
  /* 身份证号码检测 */
  checkIdCard(idCardNo) {
    let idCard = idCardNo.toString();
    // var Errors=new
    // Array("验证通过!","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
    let Errors = new Array(true, false, false, false, false);
    let area = {
      11 : "北京",
      12 : "天津",
      13 : "河北",
      14 : "山西",
      15 : "内蒙古",
      21 : "辽宁",
      22 : "吉林",
      23 : "黑龙江",
      31 : "上海",
      32 : "江苏",
      33 : "浙江",
      34 : "安徽",
      35 : "福建",
      36 : "江西",
      37 : "山东",
      41 : "河南",
      42 : "湖北",
      43 : "湖南",
      44 : "广东",
      45 : "广西",
      46 : "海南",
      50 : "重庆",
      51 : "四川",
      52 : "贵州",
      53 : "云南",
      54 : "西藏",
      61 : "陕西",
      62 : "甘肃",
      63 : "青海",
      64 : "宁夏",
      65 : "新疆",
      71 : "台湾",
      81 : "香港",
      82 : "澳门",
      91 : "国外"
    };
    let Y, JYM,S, M,ereg;
    let idCard_array =[];
    idCard_array = idCard.split("");
    // 地区检验
    if (area[parseInt(idCard.substr(0, 2))] == null)
      return Errors[4];
    // 身份号码位数及格式检验
    switch (idCard.length) {
    case 15:
      if ((parseInt(idCard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idCard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idCard.substr(6, 2)) + 1900) % 4 == 0)) {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性
      } else {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性
      }
      if (ereg.test(idCard))
        return Errors[0];
      else
        return Errors[2];
      break;
    case 18:
      // 18 位身份号码检测
      // 出生日期的合法性检查
      // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
      // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
      if (parseInt(idCard.substr(6, 4)) % 4 == 0 || (parseInt(idCard.substr(6, 4)) % 100 == 0 && parseInt(idCard.substr(6, 4)) % 4 == 0)) {
        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
      } else {
        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
      }
      if (ereg.test(idCard)) {// 测试出生日期的合法性
        // 计算校验位
        S = (parseInt(idCard_array[0]) + parseInt(idCard_array[10])) * 7 + (parseInt(idCard_array[1]) + parseInt(idCard_array[11])) * 9 + (parseInt(idCard_array[2]) + parseInt(idCard_array[12])) * 10 + (parseInt(idCard_array[3]) + parseInt(idCard_array[13])) * 5 + (parseInt(idCard_array[4]) + parseInt(idCard_array[14])) * 8 + (parseInt(idCard_array[5]) + parseInt(idCard_array[15])) * 4 + (parseInt(idCard_array[6]) + parseInt(idCard_array[16])) * 2 + parseInt(idCard_array[7]) * 1 + parseInt(idCard_array[8]) * 6 + parseInt(idCard_array[9]) * 3;
        Y = S % 11;
        M = "F";
        JYM = "10X98765432";
        M = JYM.substr(Y, 1);// 判断校验位
        if (M == idCard_array[17])
          return Errors[0]; // 检测ID的校验位
        else
          return Errors[3];
      } else
        return Errors[2];
      break;
    default:
      return Errors[1];
      break;
    }
  },
  // 进行验证
  validate_idCardBind_fastHelpFarmerValidateBind($dom){
    const realNameReg = /[\u4E00-\u9FA5]{2,}/; // 真实姓名校验规则
    let realNameFlag = true,idCardFlag = true;
    let $realNameWrong = this.dom.realName.parent().next("div"),
        $idCardWrong = this.dom.idCard.parent().next("div");
    let realNameValue=this.dom.realName.val(),idCardValue =this.dom.idCard.val();
    if ($.trim(realNameValue) === "") { // 真实姓名为空
      this.showWrongMsg($realNameWrong,"真实姓名不能为空");
      realNameFlag = false;
    } else if (!realNameReg.test($.trim(realNameValue))) { // 真实姓名校验错误
      this.showWrongMsg($realNameWrong,"真实姓名输入错误");
      realNameFlag = false;
    } else {
      this.removeMsg($realNameWrong);
      realNameFlag = true;
    }
    if ($.trim(idCardValue) === "") { // 身份证为空
      this.showWrongMsg($idCardWrong,"身份证号不能为空");
      idCardFlag = false;
    } else if (!this.checkIdCard($.trim(idCardValue))) { // 身份证校验错误
      this.showWrongMsg($idCardWrong,"请输入18位身份证号，不足以x补全");
      idCardFlag = false;
    } else {
      this.removeMsg($idCardWrong);
      idCardFlag = true;
    }
    if (realNameFlag && idCardFlag) {
      //发送身份验证请求前，将按钮身份验证按钮置为不可点击
      $dom.attr("disabled","true");
      // 身份验证
      $.ajax({ 
        url:"/lender/lender/checkIdentity",
        dataType:"json",
        method: "POST",
        data:{ 
           'realName' : $.trim(realNameValue),
           'identityCard' : $.trim(idCardValue)
        }
      }).done((msg)=>{
        if (msg == '0') {
          this.realNameValidatorDailog.title("");
          this.realNameValidatorDailog.content("<div class='sureDailog'><p class='tc yesImg'><image src='/assets/img/success.jpg'>"+
            "</p><p class='tc fs20'><b>恭喜您，通过实名认证</b></p>"+
            "</p><p class='tc'><button class='sureBtn mt20' i='close' id='sureBtn'>确定</button></p>"+
            "</div>");
          $("body").find(".ui-dialog-header").css("display","block").find("[i=close]").on("click",()=>{ 
            this.realNameValidatorDailog.close().remove();
            this.dialog=false;
            location.reload();
          });
        } else if (msg == '1') {
          // 打开身份验证到达上限提示文案
          this.showWrongMsg(this.dom.errorTips,"您今天已经达到身份验证上限（2次），请您确认个人信息后改天再次尝试，谢谢！");
        } else if (msg== '2') {
          // 身份验证失败提示文案
           this.showWrongMsg(this.dom.errorTips,"由于您填写的信息错误，未通过实名验证，请从新尝试或联系客服人员(400-0636-600)！");
        } else if (msg == '3'){
          // 身份证号码已存在
           this.showWrongMsg(this.dom.errorTips,"您输入的身份证号码已存在，请重新输入！");
        }
      }).fail((msg)=>{ 
        throw new Error(msg);
      });
    }
  },
  downloadImage(image) {
    let $form = $("<form method='POST'></form>").appendTo($("body"));
    $form.prop("action", "/helpFarmer/downLoadCertifi");
    let $input = $("<input name='pic'></input>");
    $form.append($input);
    $input.val(image);
    $form.submit();
  },
  drawCanvas(context, canvas) {
    let imgSrc = this.mapChart.getDataURL();
    let imgObj = new Image(),
      mapImgObj = new Image();
    // 证书背景图
    let backgroundUrl = this.dom.certArea.css("background-image");
    backgroundUrl = backgroundUrl.replace(/url\(/, "").replace(/\)/, "").replace(/"/g, "");
    imgObj.src = backgroundUrl;
    mapImgObj.src = imgSrc;
    let [xPos, yPos] = this.getElemPosition(this.dom.mapArea);
    // 画地图边框线
    let borderColor = this.dom.mapArea.css("border-color");
    let borderWidth = this.dom.mapArea.css("border-width");
    borderWidth = parseInt(borderWidth);
    let mapWidth = this.dom.mapArea.width(),
      mapHeight = this.dom.mapArea.height();

    // 重设src 返回promise对象
    let ImageLoad = (imageObj) => {
      return new Promise((resolve) => {
        imageObj.onload = () => {
          resolve(imageObj);
        }
      });
    };

    // 写文字信息
    let drawText = ($elem, content, lineNumber = 1) => {
      let [font, color, align] = this.getTextDrawInfo($elem);
      let [xTmpPos, yTmpPos] = this.getElemPosition($elem, "text", align);
      //console.log($elem[0].id,xTmpPos,yTmpPos);
      context.font = font;
      context.textbaseline = "middle";
      context.fillStyle = color;
      context.textAlign = align;
      // 首行缩进
      let textIndent = 0;
      textIndent = $elem.css("text-indent");
      if (!textIndent) {
        textIndent = 0;
      }
      textIndent = parseInt(textIndent);
      if (lineNumber === 1) {
        xTmpPos += textIndent;
      }
      // 第几行
      let lineHeight = $elem.css("line-height");
      lineHeight = parseInt(lineHeight);
      lineNumber = lineNumber - 1;
      yTmpPos += lineNumber * lineHeight;
      if ($elem === this.dom.yndCertTitle) {
        yTmpPos += 10;
      }
      context.fillText(content, xTmpPos, yTmpPos);
    };
    // 荣誉勋章
    let [xIconPos, yIconPos] = this.getElemPosition(this.dom.honoraryIcon);
    // 勋章promise对象
    let pIcon = this.getMedalDrawInfo();

    return Promise.all([ImageLoad(imgObj), ImageLoad(mapImgObj), pIcon]).then((result) => {
      context.drawImage(result[0], 0, 0);
      // 画地图边框线
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(xPos, yPos, mapWidth, mapHeight);
      // 画宜农贷logo
      let [xYndLogoPos, yYndLogoPos] = this.getElemPosition(this.dom.yndLogo);
      context.drawImage(this.dom.yndLogo[0], xYndLogoPos, yYndLogoPos);
      // 写证书名称
      drawText(this.dom.yndCertTitle, ImageTextInfo.yndCertTitle);
      // 写宜农贷证书编号
      drawText(this.dom.yndNo, ImageTextInfo.certifiNo);
      // 写称呼语
      drawText(this.dom.yndAppellation, ImageTextInfo.yndAppellation);
      // 写第一行内容
      drawText(this.dom.yndContent, ImageTextInfo.firstYndContent);
      // 写第二行内容
      drawText(this.dom.yndContent, ImageTextInfo.secondYndContent, 2);
      // 写第三行内容
      drawText(this.dom.yndOtherContent, ImageTextInfo.othefYndContent);
      // 特殊荣誉称号
      drawText(this.dom.honoraryTitle, ImageTextInfo.honoraryTitle);
      // 您的爱心足迹
      drawText(this.dom.loveFootPrint, ImageTextInfo.yndTrace);
      // 区块链地址
      drawText(this.dom.bcAddress, ImageTextInfo.bcAddress);
      // 日期
      drawText(this.dom.certDate, GLOBAL_CONFIG.currentDate);
      // 公章
      let [xSealIconPos, ySealIconPos] = this.getElemPosition(this.dom.sealIcon);
      context.drawImage(this.dom.sealIcon[0], xSealIconPos, ySealIconPos);
      // 画下划线
      this.dom.textFill.each((index, elemText) => {
        let elemTextWidth = $(elemText).width();
        let color_elemText = $(elemText).css("color");
        let [xElemTextPos, yElemTextPos] = this.getElemPosition($(elemText), "text");
        context.beginPath();
        context.moveTo(xElemTextPos, yElemTextPos);
        context.lineTo(xElemTextPos + elemTextWidth, yElemTextPos);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = color_elemText;
        context.stroke();
      });
      // 画地图
      context.drawImage(result[1], xPos, yPos);
      // 画勋章
      let [bgImage, sxIcon, syIcon, iconWidth, iconHeight] = result[2];
      context.drawImage(bgImage, sxIcon, syIcon, iconWidth, iconHeight, xIconPos, yIconPos, iconWidth, iconHeight);
      return canvas;
    });
  },
  getElemPosition($elem, areaType = "img", align = "left") {
    let {
      "left": pLeft,
      "top": pTop
    } = $elem.position();
    // 取得最近的定位元素
    let $offsetParent = $elem.offsetParent();
    while ($offsetParent && (!$offsetParent.hasClass("cert-info"))) {
      let {
        "left": parentLeft,
        "top": parentTop
      } = $offsetParent.position();
      pLeft += parentLeft;
      pTop += parentTop;
      $offsetParent = $offsetParent.offsetParent();
    }
    let marginTop = $elem.css("marginTop");
    let marginLeft = $elem.css("marginLeft");
    marginTop = parseInt(marginTop, 10);
    marginLeft = parseInt(marginLeft, 10);
    let xPos = pLeft + marginLeft,
      yPos = pTop + marginTop;
    if (areaType === "text") {
      let lineHeight = $elem.css("line-height");
      lineHeight = parseInt(lineHeight);
      yPos += lineHeight / 2;
    }
    let width = $elem.width();
    if (align === "center") {
      xPos += width / 2;
    } else if (align === "right") {
      xPos += width;
    }
    return [xPos, yPos];
  },
  getMedalDrawInfo() {
    let iconWidth = this.dom.honoraryIcon.width(),
      iconHeight = this.dom.honoraryIcon.height();
    let backgroundUrl = this.dom.honoraryIcon.css("background-image");
    let backgroundPostion = this.dom.honoraryIcon.css("background-position");
    let [sxIcon, syIcon] = backgroundPostion.split(" ");
    sxIcon = parseInt(sxIcon);
    syIcon = parseInt(syIcon);
    syIcon = Math.abs(syIcon);
    backgroundUrl = backgroundUrl.replace(/url\(/, "").replace(/\)/, "").replace(/"/g, "");
    let bgImage = new Image();
    bgImage.src = backgroundUrl;
    return new Promise((resolve) => {
      bgImage.onload = () => {
        resolve([bgImage, sxIcon, syIcon, iconWidth, iconHeight]);
      }
    });
  },
  getTextDrawInfo($elem) {
    let fontSize = $elem.css("font-size");
    let fontWeight = $elem.css("font-weight");
    let fontFamily = $elem.css("font-family");
    let font = [fontWeight, fontSize, fontFamily].join(" ");
    let color = $elem.css("color");
    let textAlign = $elem.css("text-align");
    return [font, color, textAlign];
  },
  getHistory() {
    $.ajax({
      "url": "/helpFarmer/historyHelpList",
      "data": {
        page: this.page,
        pageSize: this.pageSize
      },
      "method": "GET"
    }).done((ret) => {
      if (typeof ret === 'string') {
        ret = JSON.parse(ret);
      }

      if (ret.status == '0') {
        this.renderTable(ret.data);
      }
    }).fail(() => {

    });
  },
  renderTable(data) {
    let list = data.list;
    let count = data.count;
    let html = '';
    $.each(list, (index, obj) => {
      if (index == 0) {
        html += '<tr class="first-tr">' + '<td>' + obj.helpTime + '</td>' + '<td>' + obj.helpDesc + '</td>' + '<td class="bc-param">' + obj.blockHeight + '</td>' + '<td class="bc-param">' + obj.publicBlockHeight + '</td>' + '</tr>';
      } else {
        html += '<tr>' + '<td>' + obj.helpTime + '</td>' + '<td>' + obj.helpDesc + '</td>' + '<td class="bc-param">' + obj.blockHeight + '</td>' + '<td class="bc-param">' + obj.publicBlockHeight + '</td>' + '</tr>';
      }
    });
    this.dom.recordTable.find("tbody").append(html);
    if (count > (this.pageSize * this.page)) {
      this.dom.moreBtn.css("display", "block");
    } else {
      this.dom.moreBtn.css("display", "none");
    }
  },
  init(mapChart) {
    this.mapChart = mapChart;
    this.initEvent();
    this.getHistory();
  }
};

window._bd_share_config = {
  common: {
    "bdText": "",
    "bdDesc": "",
    "bdUrl": GLOBAL_CONFIG.shareUrlPC,
    "bdPic": "",
    "onBeforeClick": function(cmd, config) {
      config.bdPic = certInfo.shareImgUrl;
      config.bdText = "#公益区块链#改变公益生态，引入区块链技术！你的专属爱心账本来啦！" +
        __GLOBAL_CONFIG__.lenderCount + "位公益大咖齐上榜，你排第几名？不愿意再默默无闻的活着？新的一年，邂逅那个更好的自己。为了公益小目标，是时候撸起袖子大干一场了！@宜农贷";
      if (cmd === "weixin") {
        config.bdUrl = GLOBAL_CONFIG.shareUrlWeChat;
        //config.bdUrl=GLOBAL_CONFIG.shareUrlPC;
      } else {
        config.bdUrl = GLOBAL_CONFIG.shareUrlPC;
        if (cmd === "tqq") {
          config.bdPic = "";
        }
        if (cmd === "renren" || cmd === "douban") {
          config.bdText = "#公益区块链#";
          config.bdDesc = "改变公益生态，引入区块链技术！你的专属爱心账本来啦！" + __GLOBAL_CONFIG__.lenderCount + "位公益大咖齐上榜，你排第几名？不愿意再默默无闻的活着？新的一年，邂逅那个更好的自己。为了公益小目标，是时候撸起袖子大干一场了！@宜农贷";
        }
      }
      return config;
    }
  },
  "share": {
    "bdSize": 16
  }
}

// export {
//   certInfo
// };