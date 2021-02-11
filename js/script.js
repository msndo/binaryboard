;(function(global, undefined) {
  // ============================================== Main Routine

  document.addEventListener('DOMContentLoaded', () => {
    buildStatusHolder();
    // initScreen();

    initScreenTransition();
  });

  // ============================================== Sub Routines
  function initScreenTransition() {
    barba.init({
      transitions: [
        {
          async leave (data) {
            const done = this.async();
            const elemMain = data.current.container.querySelector('main');

            elemMain.classList.add('swipeOut');

            await(_delay(700));
            done();
          },
          async enter (data) {
            data.next.container.querySelector('main').classList.add('swipeIn');
          }
        }
      ],
    views: [
        {
          namespace: 'emptyswitchboard',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
            });
          }
        },
        {
          namespace: 'dottedLow',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.initDotPicture();
            });
          }
        },
        {
          namespace: 'switchimage',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.switchImage();
            });
          }
        },
        {
          namespace: 'bindimage',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.bindImage();
            });
          }
        },
        {
          namespace: 'color',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
            });
          }
        },
        {
          namespace: 'add',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.demoCalcAdd();
            });
          }
        },
        {
          namespace: 'alloc',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.initConsole();
            });
          }
        },
        {
          namespace: 'console',
          beforeEnter (data) {
            setTimeout(() => {
              initScreen();
              screenIndividual.initConsole();
              screenIndividual.calcAddOnConsole();
              screenIndividual.initPaint();
            }, 300);
          }
        },
      ]
    });

    function _delay (n) {
      n = n || 2000;
      return new Promise((done) => {
        setTimeout(() => {
          done();
        }, n);
      });
    }
  }


  function initScreen() {

    const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch:not(.result .contentSwitch)'));

    seriesElemSwitch.forEach (elemSwitch => {
      elemSwitch.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        toggleSwicth(elemSwitch);

        if(elemSwitch.classList.contains('on')) {
          statusForDragOperation.stateTo = true;
        }
        else {
          statusForDragOperation.stateTo = false;
        }

        screenEffect.swellBounce(elemSwitch);
        screenEffect.fireParticle(elemSwitch);
      });
      elemSwitch.addEventListener('mousemove', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          ev.preventDefault();
        }
      });

      elemSwitch.addEventListener('touchmove', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          ev.preventDefault();

          const infoTouch = ev.touches;
          const ixLast = infoTouch.length - 1;

          const clientX = infoTouch[ixLast].pageX;
          const clientY = infoTouch[ixLast].pageY;
          const elemTarget = document.elementFromPoint(clientX, clientY);

          if(!elemTarget.classList.contains('contentSwitch')) {
            return;
          }

          if(statusForDragOperation.stateTo) {
            turnOnSwitch(elemTarget);
          }
          else {
            turnOffSwitch(elemTarget);
          }

          screenEffect.swellBounce(elemTarget);
          screenEffect.fireParticle(elemTarget);
        }
      });

      elemSwitch.addEventListener('mouseenter', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          if(statusForDragOperation.stateTo) {
            turnOnSwitch(elemSwitch);
          }
          else {
            turnOffSwitch(elemSwitch);
          }

          screenEffect.swellBounce(elemSwitch);
          screenEffect.fireParticle(elemSwitch);
        }
      });
      elemSwitch.addEventListener('mouseleave', (ev) => {
        ev.preventDefault();
        if(statusForDragOperation.isMouseButtonPressed) {
        }
      });
    });

    bindActionIncDec();

    if(document.querySelector('.appdemoBinarySwitch')) {
      initBinaryColorCodeUI(seriesElemSwitch);
    }
  }


  function bindActionIncDec() {
    const seriesCtrlIncDec = Array.from(document.querySelectorAll('.controlIncDec'));
    seriesCtrlIncDec.forEach(ctrlIncDec => {
      ctrlIncDec.addEventListener('pointerdown', (ev) => {
        repeatOnPressingDevice(ctrlIncDec, ev);
      });
    });
  }


  function buildStatusHolder() {
    global.statusForDragOperation = {
      isMouseButtonPressed: false,
      stateTo: false
    };

    document.body.addEventListener('pointerdown', () => {
      statusForDragOperation.isMouseButtonPressed = true;
    })
    document.body.addEventListener('pointerup', () => {
      statusForDragOperation.isMouseButtonPressed = false;
    });
  }

  global.screenEffect = {  };

  screenEffect.swellBounce = function(elemCtrl) {
    elemCtrl.classList.add('swell');
    setTimeout(function() {
      elemCtrl.classList.remove('swell');
    }, 800);
  } 

  screenEffect.fireParticle = function(elemCtrl) {
    elemCtrl.parentNode.classList.add('particle');
    setTimeout(function() {
      elemCtrl.parentNode.classList.remove('particle');
    }, 800);
  }

  function initBinaryColorCodeUI(seriesElemSwitch) {
    seriesElemSwitch.forEach (elemSwitch => {
      elemSwitch.addEventListener('pointerdown', () => {
        applyColorOnSwicth(elemSwitch);
      });

      elemSwitch.addEventListener('touchmove', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          ev.preventDefault();

          const infoTouch = ev.touches;
          const ixLast = infoTouch.length - 1;

          const clientX = infoTouch[ixLast].pageX;
          const clientY = infoTouch[ixLast].pageY;
          const elemTarget = document.elementFromPoint(clientX, clientY);

          if(!elemTarget.classList.contains('contentSwitch')) {
            return;
          }

          applyColorOnSwicth(elemTarget);
        }
      });
      elemSwitch.addEventListener('mouseenter', () => {
        if(statusForDragOperation.isMouseButtonPressed) {
          applyColorOnSwicth(elemSwitch);
        }
      });
    });
  }

  function repeatOnPressingDevice(elemCtrl, ev) {
    const durationWait = 500;
    const durationInterval = 140;

    let timerWait = null;
    let timerRepeat = null;

    classnameCharging = 'charging';
    classnameBeginShaking = 'beginShaking'
    classnameShaking = 'shaking';

    actionOnIncDec(elemCtrl);
    elemCtrl.classList.add(classnameCharging);
    elemCtrl.classList.add(classnameBeginShaking);

    timerWait = setTimeout(() => {
      elemCtrl.classList.remove(classnameBeginShaking);
      elemCtrl.classList.add(classnameShaking);

      timerRepeat = setInterval(() => {
        actionOnIncDec(elemCtrl);
      }, durationInterval);
    }, durationWait);

    elemCtrl.addEventListener('pointerup', (ev) => {
      _quit(ev);
    });
    elemCtrl.addEventListener('pointerleave', (ev) => {
      _quit(ev);
    });

    function _quit(ev) {
      ev.preventDefault();

      clearInterval(timerRepeat);
      clearTimeout(timerWait);

      timerWait = null;
      timerRepeat = null;

      elemCtrl.classList.remove(classnameBeginShaking);
      elemCtrl.classList.remove(classnameShaking);
      elemCtrl.classList.remove(classnameCharging);
    }
  }

  function actionOnIncDec(elemCtrl) {
    const incDec = (function() {
      let ret = 'dec';
      if(elemCtrl.classList.contains('controlInc')) {
        ret = 'inc';
      }
      return ret;
    })();

    const elemContainer = elemCtrl.closest('.componentSwitchHex');
    const seriesElemSwitch = Array.from(elemContainer.querySelectorAll('.contentSwitch'));

    const elemValue = elemCtrl.closest('.componentSwitchHex').querySelector('.codeHex');
    const elemColorPainted = document.querySelector('.contentPainted');

    const valueFrom = parseInt(elemValue.innerText, 16);
    let valueTo = 0;

    if(incDec === 'inc') { valueTo = valueFrom + 1; }
    else { valueTo = valueFrom - 1; }

    if (valueTo > 15) { valueTo = 0x0; }
    if(valueTo < 0) { valueTo = 0xffff; }

    const valueToInBinary = ('0000' + valueTo.toString(2)).slice(-4);

    valueToInBinary.split('').forEach((value, ix) => {
      const elemSwitch = seriesElemSwitch[ix];

      if(value === '1') { elemSwitch.classList.add('on'); }
      else { elemSwitch.classList.remove('on'); }

      applyHex(elemSwitch);

      if(elemColorPainted) {
        applyColor(elemColorPainted);
      }
    });
  }

  function turnOnSwitch(elemSwitch) {
    elemSwitch.classList.add('on');
  }
  function turnOffSwitch(elemSwitch) {
    elemSwitch.classList.remove('on');
  }


  function toggleSwicth(elemSwitch) {
    if(elemSwitch.classList.contains('on')) {
      turnOffSwitch(elemSwitch);
    }
    else {
      turnOnSwitch(elemSwitch);
    }
  }

  function applyColorOnSwicth(elemSwitch) {
    applyHex(elemSwitch);

    const elemColorPainted = document.querySelector('.contentPainted');
    if(elemColorPainted) {
      applyColor(elemColorPainted);
    }
  }


  function applyColor(elemColorPainted) {
    const seriesElemHex = Array.from(document.querySelectorAll('.codeHex'));

    const seriesCodeHex = [];
    seriesElemHex.forEach(elemHex => {
      seriesCodeHex.push(elemHex.innerText);
    });

    const colorCode = seriesCodeHex.join('');

    document.querySelector('.joinedCode').innerText = '#' + colorCode;
    elemColorPainted.style.backgroundColor = '#' + colorCode;
  }

  function applyHex(elemCtrl) {
    const container = elemCtrl.closest('.componentSwitchHex');
    const elemCodeHex = container.querySelector('.codeHex');
    const seriesElemSwitch = Array.from(container.querySelectorAll('.contentSwitch'));

    const seriesOnOff = [];
    seriesElemSwitch.forEach(elemSwitch => {
      const onOff = elemSwitch.classList.contains('on') ? '1' : '0';
      seriesOnOff.push(onOff);
    });

    const codeHex =  parseInt(seriesOnOff.join(''), 2).toString(16);
    elemCodeHex.innerText = codeHex;

    // trigger 'changeContent'
    var event = document.createEvent('HTMLEvents');
    event.initEvent('changeContent', true, false);
    elemCodeHex.dispatchEvent(event);

    applyColorToPrimeColorBar(elemCtrl);

    return codeHex;
  }

  function applyColorToPrimeColorBar(elemCtrl) {
    const elemContainerPrimeColor = elemCtrl.closest('.containerPrimeColor');
    if(!elemContainerPrimeColor) { return; }

    const codePrimeColor = (function() {
      const seriesCode = [];
      const seriesElemCodeHex = Array.from(elemContainerPrimeColor.querySelectorAll('.codeHex'));
      seriesElemCodeHex.forEach((elemCodeHex) => {
        seriesCode.push(elemCodeHex.innerText);
      });

      return seriesCode.join('');
    })();

    if(elemContainerPrimeColor.classList.contains('containerPrimeColorR')) {
      elemContainerPrimeColor.style.borderBottomColor = '#' + codePrimeColor + '0000';
    }
    if(elemContainerPrimeColor.classList.contains('containerPrimeColorG')) {
      elemContainerPrimeColor.style.borderBottomColor = '#' + '00' + codePrimeColor + '00';
    }
    if(elemContainerPrimeColor.classList.contains('containerPrimeColorB')) {
      elemContainerPrimeColor.style.borderBottomColor = '#' + '0000' + codePrimeColor;
    }
  }


  // =============================================== Individual Function
  global.screenIndividual = {  };

  screenIndividual.switchImage = function() {
    const seriesImgFrom = Array.from(document.querySelectorAll('.imgEtoSrc'));
    const elemCodeHex = document.querySelector('.codeHex');
    const elemDest = document.querySelector('.contentScreen');

    elemCodeHex.addEventListener('changeContent', (ev) => {
      const hex = elemCodeHex.innerText;

      const decSrc = parseInt('0x' + hex, 16);
      const decDest = (function() {
        if(decSrc > 12) {
          return 13;
        }
        return decSrc;
      })();

      let elemImgFrom = seriesImgFrom[decDest];
      let imgSrc = elemImgFrom.getAttribute('src');
      let imgAlt = elemImgFrom.getAttribute('alt');

      elemDest.setAttribute('src', imgSrc);
      elemDest.setAttribute('alt', imgAlt);

      const elemCodeDec = document.querySelector('.codeDec');
      elemCodeDec.innerText = decSrc;
    });
  }

  screenIndividual.bindImage = function() {
    const seriesImgFrom = Array.from(document.querySelectorAll('.imgEtoSrc'));
    const elemCodeHex = document.querySelector('.codeHex');
    const elemDest = document.querySelector('.contentScreen');

    elemCodeHex.addEventListener('changeContent', (ev) => {
      const hex = elemCodeHex.innerText;

      const decSrc = parseInt('0x' + hex, 16);
      const decDest = (function() {
        if(decSrc > 12) {
          return 13;
        }
        return decSrc;
      })();

      let elemImgFrom = seriesImgFrom[decDest];
      let imgSrc = elemImgFrom.getAttribute('src');
      let imgAlt = elemImgFrom.getAttribute('alt');

      elemDest.setAttribute('src', imgSrc);
      elemDest.setAttribute('alt', imgAlt);

      const elemCodeDec = document.querySelector('.codeDec');
      elemCodeDec.innerText = decSrc;
    });
  }

  screenIndividual.demoCalcAdd = function(signPlusSrc) {
    const signPlus = signPlusSrc ? signPlusSrc : document.querySelector('.signPlus');
    signPlus.addEventListener('click', (ev) => {
      screenEffect.swellBounce(signPlus);
      screenIndividual.movementBitAdd();
      screenEffect.fireParticle(signPlus);
    });
  }

  screenIndividual.movementBitAdd = function(bunchOfBitAddedSrc, bunchOfBitAddSrc, bunchOfBitResultSrc, signPlusSrc) {
    const settings = {
      waitBitTransition: 100,
      classnameTurnedOn: 'on'
    };

    const seriesBunchOfBit = Array.from(document.querySelectorAll('.componentSwitchHex'));
    const bunchOfBitAdded = bunchOfBitAddedSrc ? bunchOfBitAddedSrc : Array.from(seriesBunchOfBit[0].querySelectorAll('.contentSwitch'));
    const bunchOfBitAdd = bunchOfBitAddSrc ? bunchOfBitAddSrc : Array.from(seriesBunchOfBit[1].querySelectorAll('.contentSwitch'));
    const bunchOfBitResult = bunchOfBitResultSrc ? bunchOfBitResultSrc : Array.from(seriesBunchOfBit[2].querySelectorAll('.contentSwitch'));

    const signPlus = signPlusSrc ? signPlusSrc : document.querySelector('.signPlus');

    const promise = new Promise((resolve, reject) => {
      _movmentMain(resolve, reject);
    });

    return promise;

    function _movmentMain(resolve, reject) {
      bunchOfBitResult.forEach((bitResult) => {
        bitResult.classList.remove(settings.classnameTurnedOn);
      });

      // +++++++++++++++++++++++++++++++ ビット演算を展開
      // push, popは使わずインデックス参照でやる
      const ixLowerEndCalculated = bunchOfBitAdded.length - 1;

      let ixBitResult, digitAdded, digitAdd, digitCarry, xorAddedAdd;

      for(let ix = ixLowerEndCalculated; ix >= 0; ix --) {
        setTimeout(() => { // setTimeout コマ送り動作
          ixBitResult = ix + 1;

          digitAdded = bunchOfBitAdded[ix].classList.contains(settings.classnameTurnedOn);
          digitAdd = bunchOfBitAdd[ix].classList.contains(settings.classnameTurnedOn);
          digitCarry = bunchOfBitResult[ixBitResult].classList.contains(settings.classnameTurnedOn);

          // 対象二項のXOR判定
          xorAddedAdd = (digitAdded ^ digitAdd) ? true : false;
          // 繰り上げが伝達されている場合は反転
          resultBitCurrent = (xorAddedAdd ^ digitCarry) ? true : false;

          // 当該桁の結果描画
          if(resultBitCurrent) {
            bunchOfBitResult[ixBitResult].classList.add(settings.classnameTurnedOn);
          }
          else {
            bunchOfBitResult[ixBitResult].classList.remove(settings.classnameTurnedOn);
          }

          screenEffect.fireParticle(bunchOfBitResult[ixBitResult]);

          // 繰り上げを一位上の桁にストア（一時的に描画）
          if(((digitAdded && !digitAdd) || (!digitAdded && digitAdd)) && digitCarry) {
            bunchOfBitResult[ixBitResult -1].classList.add(settings.classnameTurnedOn);

            // 最上位に繰り上がるときはパーティクルを発生
            if(ixBitResult -1 === 0) {
              setTimeout(() => {
                screenEffect.fireParticle(bunchOfBitResult[ixBitResult - 1]);
              }, settings.waitBitTransition);
            }
          }
          if((digitAdded && digitAdd)) {
            bunchOfBitResult[ixBitResult -1].classList.add(settings.classnameTurnedOn);

            if(ixBitResult -1 === 0) {
              setTimeout(() => {
                screenEffect.fireParticle(bunchOfBitResult[ixBitResult - 1]);
              }, settings.waitBitTransition);
            }
          }

          if(ix <= 0) { resolve(); }
        }, settings.waitBitTransition * ((bunchOfBitResult.length - 1) - (ix + 1)));
      }
    }
  }

  screenIndividual.initConsole = function() {
    const seriesContentSwitch = Array.from(document.querySelectorAll('.indicationAddress'));
    seriesContentSwitch.forEach((contentSwitch, ix) => {
      contentSwitch.innerText = ix;
    });

    Array.from(document.querySelectorAll('.modeSelect')).forEach((elemTrigger) => {
      const nameMode = elemTrigger.getAttribute('data-task');
      elemTrigger.addEventListener('click', (ev) => {
        Array.from(document.querySelectorAll('.commandBoard')).forEach((elemDest) => {
          elemDest.classList.remove('show');
        });

        const elemDest = document.querySelector('.commandBoard' + '[data-task="__nameMode__"]'.replace('__nameMode__', nameMode));
        elemDest.classList.add('show');
      });
    });
  }

  screenIndividual.toHalfWidth = function(input) {
    return input.replace(/[！-～]/g,
      function(input){
        return String.fromCharCode(input.charCodeAt(0)-0xFEE0);
      }
    );
  };

  screenIndividual.calcAddOnConsole = function() {
    const elemContainer = document.querySelector('.commandBoard[data-task="add"]');

    const elemInputValueAdded = elemContainer.querySelector('#valueAdded');
    const elemInputValueAdd = elemContainer.querySelector('#valueAdd');
    const elemTriggerExecTask = elemContainer.querySelector('.triggerExecTask');
    const elemValueResult = elemContainer.querySelector('#valueResult');

    const textOnScreen = document.querySelector('.codeDec');

    // ワークエリアをスイッチ列上に割当
    const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch'));
    const rangeSwitchAdded = seriesElemSwitch.slice(32, 40);
    const rangeSwitchAdd = seriesElemSwitch.slice(40, 48);
    const rangeSwitchResult = seriesElemSwitch.slice(55, 64);


    elemInputValueAdded.addEventListener('change', function(ev) {
      ev.target.value = screenIndividual.toHalfWidth(ev.target.value);
      _validate(ev.target);
      _applyValueToSwitch(ev.target, 32);
    });
    elemInputValueAdd.addEventListener('change', function(ev) {
      ev.target.value = screenIndividual.toHalfWidth(ev.target.value);
      _validate(ev.target);
      _applyValueToSwitch(ev.target, 40);
    });

    // 加算動作実行
    elemTriggerExecTask.addEventListener('click', (ev) => {
      screenIndividual.movementBitAdd(rangeSwitchAdded, rangeSwitchAdd, rangeSwitchResult)
        .then(() => { _renderResult(); })
      ;
    });

    function _renderResult() {
      const seriesBitResult = [];
      rangeSwitchResult.forEach((switchResult, ix) => {
        if(switchResult.classList.contains('on')) { seriesBitResult.push('1'); }
        else { seriesBitResult.push('0'); }
      });

      const textResult =  parseInt(seriesBitResult.join(''), 2).toString(10);
      elemValueResult.value = textResult;

      textOnScreen.innerHTML = textResult;
    }

    function _applyValueToSwitch(elemValue, ixOffset) {
      const lengthBit = 8;
      const ixEnd = ixOffset + (lengthBit - 1);

      const seriesValueInBit = ('0'.repeat(lengthBit) + (Number(elemValue.value).toString(2))).slice(0 - lengthBit).split('');

      const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch'))

      seriesValueInBit.reverse().forEach((valueInBit, ix) => {
        const elemSwitch = seriesElemSwitch[ixEnd - ix];
        elemSwitch.classList.remove('on');

        if(valueInBit === '1') {
          elemSwitch.classList.add('on')
        }
      });
    }

    function _validate(elem) {
      const valueSrc = elem.value;

      const seriesValueChar = valueSrc.split('');
      seriesValueChar.forEach((valueChar, ix) => {
        if(!valueChar.match(/[0-9]/)) {
          seriesValueChar[ix] = 0;
        }
      });

      const valueOut = (() => {
        const value = Number(seriesValueChar.join(''));
        if(value > 255) { return 255; }
        return value;
      })();

      elem.value = valueOut;
    }
  }

  screenIndividual.initPaint = function() {
    const elemContainer = document.querySelector('.commandBoard[data-task="colorcode"]');
    const elemInput = elemContainer.querySelector('#valueColorCode');
    const limitLengthCode = 6;

    elemInput.addEventListener('change', (ev) => {
      const strCodeSrc = screenIndividual.toHalfWidth(elemInput.value);
      const seriesCode = strCodeSrc.split('');
      seriesCode.forEach((code, ix) => {
        if(!code.match(/[0-9|a-f]/)) {
          seriesCode[ix] = 'f';
        }
      });
      elemInput.value = seriesCode.join('');

      if(elemInput.value.length < limitLengthCode) {
        elemInput.value = ('000000' + elemInput.value).slice(0 - limitLengthCode);
      }
      if(elemInput.value.length > limitLengthCode) {
        elemInput.value = elemInput.value.slice(0, limitLengthCode);
      }
    });

    const elemTrigger = elemContainer.querySelector('.triggerExecTask');

    elemTrigger.addEventListener('click', (ev) => {
      const lengthBit = 24;
      const wait = 29;

      const colorCodeInBit = ('0'.repeat(lengthBit) + (parseInt(elemInput.value, 16).toString(2))).slice(0 - lengthBit);
      const seriesBit = colorCodeInBit.split('');

      const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch'))

      seriesBit.reverse().forEach((bit, ix) => {
        setTimeout(() => {
          const elemSwitch = seriesElemSwitch[(lengthBit - 1) - ix];
          elemSwitch.classList.remove('on');
          if(bit === '1') { elemSwitch.classList.add('on'); }
          screenEffect.fireParticle(elemSwitch);

          if(ix >= seriesBit.length - 1) {
            (function() {
              const elemBgDisplay = document.querySelector('.containerScreen .display');
              elemBgDisplay.style.backgroundColor = '#' + elemInput.value;
            })();
          }
        }, ix * wait);
      });
    });
  };

  screenIndividual.initDotPicture = function() {
    const seriesDot = Array.from(document.querySelectorAll('.containerSeriesDot .dot'));
    const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch'));

    seriesElemSwitch.forEach((elemSwitch, ix) => {
      elemSwitch.addEventListener('pointerdown', (ev) => {
         _movementDrawDot(elemSwitch, ix);
      });

      elemSwitch.addEventListener('touchmove', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          const infoTouch = ev.touches;
          const ixLast = infoTouch.length - 1;

          const clientX = infoTouch[ixLast].pageX;
          const clientY = infoTouch[ixLast].pageY;
          const elemTarget = document.elementFromPoint(clientX, clientY);

          if(!elemTarget.classList.contains('contentSwitch')) {
            return;
          }

         _movementDrawDot(elemSwitch, ix);
        }
      });
      elemSwitch.addEventListener('mouseenter', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          _movementDrawDot(elemSwitch, ix);
        }
      });
    });

    function _movementDrawDot(elemSwitch, ix) {
      const dotTarg = seriesDot[ix];

      if(elemSwitch.classList.contains('on')) {
        dotTarg.classList.add('on')
      }
      else {
        dotTarg.classList.remove('on');
      }
    }
  };

})(window, void(0));
