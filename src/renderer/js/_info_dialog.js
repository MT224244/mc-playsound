//@ts-check

import $ from 'jquery';
import { shell } from 'electron';
import { MDCDialog } from '@material/dialog';
import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { readFileSync } from 'fs';

/** @type {MDCDialog} */
let dialogInfo;

/** @type {MDCList} */
let listLicenses;

$(document).ready(() => {
    dialogInfo = new MDCDialog($('#dialog-info').get(0));
    listLicenses = new MDCList($('#list-licenses').get(0));

    dialogInfo.scrimClickAction = '';
    dialogInfo.escapeKeyAction = '';

    /** @type {{name: string, version: string, author: string, license: string, repository: string}} */
    let pkg;
    try { pkg = JSON.parse(readFileSync('resources/app.asar/package.json', 'utf8')); }
    catch { pkg = JSON.parse(readFileSync('package.json', 'utf8')); }

    $('#version').text(pkg.version);
    $('#author').text(pkg.author);
    $('#license').text(pkg.license);
    $('#repository').html(`<a href="#">${pkg.repository}</a>`);
    $('#repository').on('auxclick', () => { return false; });
    $('#repository').on('click', function () { shell.openExternal($(this).text()); });

    $('#nodejs-version').text(process.versions.node);
    $('#electron-version').text(process.versions.electron);
    $('#chrome-version').text(process.versions.chrome);
    $('#v8-version').text(process.versions.v8);

    $('#btn-info').on('click', () => dialogInfo.open());

    /** @type {{}} */
    let licenses;
    try { licenses = JSON.parse(readFileSync('resources/app.asar/dist/renderer/resource/licenses.json', 'utf8')); }
    catch { licenses = JSON.parse(readFileSync('dist/renderer/resource/licenses.json', 'utf8')); }

    /** @type {string[]} */
    let elems = [];

    Object.keys(licenses).forEach(key => {
        /** @type {string} */
        let lic = licenses[key].licenses;
        /** @type {string} */
        const repository = licenses[key].repository;

        if (!lic.startsWith('(')) lic = `(${lic})`;

        if (key !== `${pkg.name}@${pkg.version}`) elems.push(`
            <li class="mdc-list-item" role="option" data-value="${repository}">
                <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">${key} ${lic}</span>
                    <span class="mdc-list-item__secondary-text">${repository}</span>
                </span>
            </li>`);
    });

    $('#list-licenses').append($(elems.join('')));
    $('#list-licenses .mdc-list-item').each((i, elem) => { new MDCRipple(elem); });
    listLicenses.singleSelection = true;
    listLicenses.listen('click', () => {
        if (typeof listLicenses.selectedIndex !== 'number') return;

        /** @type {string} */
        const url = $(listLicenses.listElements[listLicenses.selectedIndex]).data('value');

        console.log(listLicenses.selectedIndex);
        shell.openExternal(url);
        $(listLicenses.listElements[listLicenses.selectedIndex]).removeClass('mdc-list-item--selected');
    });
});