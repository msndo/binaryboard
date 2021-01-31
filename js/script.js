;(function(global, undefined) {
  // ============================================== Main Routine
  buildStatusHolder();

  document.addEventListener('DOMContentLoaded', () => {
    const seriesElemSwitch = Array.from(document.querySelectorAll('.contentSwitch'));


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

        fireParticle(elemSwitch);
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
          fireParticle(elemTarget);
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
          fireParticle(elemSwitch);
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
  });

  // ============================================== Sub Routines
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

  function fireParticle(elemSwitch) {
    elemSwitch.parentNode.classList.add('particle');
    setTimeout(function() {
      elemSwitch.parentNode.classList.remove('particle');
    }, 800);
  }

  function initBinaryColorCodeUI(seriesElemSwitch) {
    seriesElemSwitch.forEach (elemSwitch => {
      elemSwitch.addEventListener('pointerdown', () => {
        applyColorOnSwicth(elemSwitch);
      });

      elemSwitch.addEventListener('mousemove', (ev) => {
        if(statusForDragOperation.isMouseButtonPressed) {
          ev.preventDefault();
          applyColorOnSwicth(elemSwitch);
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

})(window, void(0));
