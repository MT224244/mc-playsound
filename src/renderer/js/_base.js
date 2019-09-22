//@ts-check

import $ from 'jquery';
import { ipcRenderer } from 'electron';
import { MDCRipple } from '@material/ripple';

// デバッグ用
// require('electron-connect').client.create();

$(document).ready(() => {
    $('.mdc-button, .mdc-fab').each((i, elem) => { new MDCRipple(elem) });
    
    $('button').on('focus', function() { this.blur(); });

    $('#btn-close').on('click', () => ipcRenderer.send('onClose'));
    $('#btn-maximize').on('click', () => ipcRenderer.send('onMaximize'));
    $('#btn-minimize').on('click', () => ipcRenderer.send('onMinimize'));
    $(window).on('blur', () => $('#titlebar').addClass('blur'));
    $(window).on('focus', () => $('#titlebar').removeClass('blur'));
});

ipcRenderer.on('title', (e, args) => $('#title').text(args));

ipcRenderer.on('maximize', () => $('#wrapper').addClass('maximizing'));
ipcRenderer.on('restore', () => $('#wrapper').removeClass('maximizing'));