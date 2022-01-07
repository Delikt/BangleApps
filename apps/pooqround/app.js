/* -*- mode: Javascript; c-basic-offset: 2; indent-tabs-mode: nil; coding: latin-1 -*- */
// pooqRound

// Copyright (c) 2021 Stephen P Spackman
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// Notes:
//
// This only works for Bangle 2.

const isString = x => typeof x === 'string',
      imageWidth = i => isString(i) ? i.charCodeAt(0) : i.width;

//////////////////////////////////////////////////////////////////////////////
/*                           System integration                             */

const storage = require('Storage');

//////////////////////////////////////////////////////////////////////////////
/*                          Face-specific options                           */

class Options {
    // Protocol: subclasses must have static id and defaults fields.
    // Only fields named in the defaults will be saved.
    constructor() {
        this.id = this.constructor.id;
        this.file = `${this.id}.json`;
        this.backing = storage.readJSON(this.file, true) || {};
        Object.setPrototypeOf(this.backing, this.constructor.defaults);
        this.reactivator = _ => this.active();
        Object.keys(this.constructor.defaults).forEach(k => this.bless(k));
    }

    writeBack(delay) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            () => {
                this.timeout = null;
                storage.writeJSON(this.file, this.backing);
            },
            delay
        );
    }
    
    bless(k) {
        Object.defineProperty(this, k, {
            get: () => this.backing[k],
            set: v => {
                this.backing[k] = v;
                // Ten second writeback delay, since the user will roll values up and down.
                this.writeBack(10000);
            }
        });
    }

    showMenu(m) {
        if (m instanceof Function) m = m();
        if (m) {
            for (const k in m) if ('init' in m[k]) m[k].value = m[k].init();
            m[''].selected = -1; // Workaround for self-selection bug.
            Bangle.on('drag', this.reactivator);
            this.active();
        } else {
            if (this.bored) clearTimeout(this.bored);
            this.bored = null;
            Bangle.removeListener('drag', this.reactivator);
            this.emit('done');
        }
        E.showMenu(m);
    }

    active() {
        if (this.bored) clearTimeout(this.bored);
        this.bored = setTimeout(_ => this.showMenu(), 15000);
    }
    
    reset() {
        this.backing = {__proto__: this.constructor.defaults};
        this.writeBack(0);
    }
}

class RoundOptions extends Options {
    constructor() {
        super();
        this.menu = () => ({
            '': {title: '* face options *'},
            '< Back': _ => this.showMenu(),
            Ticks: {
                init: _ => this.resolution,
                min: 0, max: 3,
                onchange: x => this.resolution = x,
                format: x => ['seconds', 'seconds (up)', 'minutes', 'hours'][x]
            },
            Calendar: {
                init: _ => this.calendric,
                min: 0, max: 5,
                onchange: x => this.calendric = x,
                format: x => ['none', 'day', 'date', 'both', 'month', 'full'][x],
            },
            'Autorotate': {
                init: _ => this.autorotate,
                onchange: x => this.autorotate = x
            },
            Defaults: _ => {this.reset(); this.interact();}
        });
    }
  
    interact() {this.showMenu(this.menu);}
}

RoundOptions.id = 'pooqround';

RoundOptions.defaults = {
    resolution: 1,
    calendric: 5,
    dayFg: '#fff',
    nightFg: '#000',
    autorotate: true,
};

//////////////////////////////////////////////////////////////////////////////
/*         Assets (generated by resourcer.js, in this directory)            */

const heatshrink = require('heatshrink');
const dec = x => E.toString(heatshrink.decompress(atob(x)));
const y10F = [
  dec(
    'g///EAh////AA4IIBgPwgE+gAOBg/AngXB+EPAYM8gfggEfgF8D4OAj4dB8EDAYI' +
    'fBBAISBAAMOAYUB4AECnEAkAuBgEQBAPgIYX8IYX/wYDCEwIiMMgUcgECCIZlBAY' +
    'N4CoRUBIoMP8AZBge8MoMB8+B8B4B+E/gf4jw/B/kD4ADBEQMPSYXgoAfBnEwgeA' +
    'hw7BvEDx4PBgHn4EB8E7LQM8h/eJ4MDBgIpB+H+g/wnE/WwMMG4ReBn4zBJYKcDH' +
    '4IABv+AXoSGCv0eAYP/FIMB/4iBTAIJBGIJ6B/yQCb4RDBEQTlBHoIOBn51BwC+B' +
    'MoWDAwKYBRgKYBCYM8hwKBMoODegPA8F+gZlBewP4hz/BE4QrBGgM/LAV//4+BAY' +
    'JyBPwM/KQMeGQMPFwM8H4UHBIPwGQNwZgPwnhxBGQJxBGQK5BGQKWDOwUACALlBI' +
    'YRrB8H///gnI+COwJGBgaUBWgqVDhgDCZYIADFIKAB84eBIwImBXwP8MoPwviYCI' +
    'AKYBIAKYB4JlCPwJlBS4IdC/IeBFwJlCh6XCY4Q2BLYMIDQN8PIPwg+B4B2B8FwG' +
    'oN4TgPAnk+MoM+v6tBGQOAZQJ3CQwUAA'
  ), 48, dec('hgAI'), 34
];const y1F = [
  dec(
    'g//AAPggE/AoX8gF/AoX+gF8CoU+gHwAoUPgAZBEIQFGCIodFFIo1FIIoADnEAgQ' +
    'FCjkAgwFCh0Ahg1EBoIABgeAFIf/4A1DFQIED/5MDGAYADEQYwDRwgMDhAYEH4Nw' +
    'AoUeAok/QYl/wAFD/fAHgUD+PgvAFBj/g+E/4EBLAN4j5SCgE8h4EB/AwCAoOAVA' +
    'PgggeBFoPgQgRLB8E8I4fgXQS/B8KwBMgOA8YFCgfA9+eAoMB4H/j/ACIPA/kPCQ' +
    'JIB/DMDMoJSBboQVBKoIDBSYZOBAAQlCAATpEg/4Xwc/QIZyBwBcBgf//gxBa4Qb' +
    'Ba4LZDv/4LwRfCGAcBGAYABC4IYCD4QjCR4IFDR4R6BR4QFDMAIFDF4IFBC4IIBA' +
    'oLEBBYQlBI4IFDR4ZrBR4QFBTgJMDHoaaCdQSmCC4SyCYYJJB+CHBj+Aj8ASYJNB' +
    'BINwIIOAM4ILDAYN/wABBB4JBBI45vCRYgADApEHL4pHB8AECFIPhAYLCCAggFBA' +
    'gaNCYwgFEbAkAwAFEc4SPCj/+LIKPBv6PEAoRnBFIMDFYLXCKoTLDa4YRDBYIdDh' +
    '4FDMoQ1DK4ZBBMQIDBJYbWBFIMEIIQpBgxxBgZRBh8AAYN8AoQVBjgbBAoTZBvwR' +
    'CvEBF4IdB+E/OIp9CJgZBCQQUAA='
  ), 48, dec('hgAI'), 48
];const y10sF = [
  dec(
    'j/+gP//0PgE8mEAmHwgfBBQINB8AWDgcAoEGAYMMj///H///wBwNgAQPAAQMgg8B' +
    'wE+hkA9kwg8Y+F4mP/4Fg/AVD4EBgcCg0MnEMmfgmH94PD4f+hkHIIgbBg44B/ng' +
    'h/H/H8n4IBg4QBhwUC//Bgf+FYMwAIPAjHDwPjg//gEPLgUAOYMAn/+DAM8j1gmH' +
    'h8fDBAMIHIRwDQAJtBg/8mH+gHPwEDCII/DAAM+n8B/v+h0+jkwuEw8fhV4UD8Yr' +
    'DjxDB/0Ch88CoLEB+fPwK0BKIOACoQA='
  ), 48, dec('hAAI'), 22
];const y1sF = [
  dec(
    'j///0A/4ABgfAgEPgwNBg0MAYMMjwDBvAWB//gh4DBEAUDgEgAYQeBgcDEwQSCCY' +
    'oDCiACBwFgGoOBwEAnODBwPhw/Ag+Bw/gv0Bwf/+EBwAkBgPgCYOA4EQgIeB8ASB' +
    'g/AgcGnuAg0N8fAnkfIwPwnEB/40BgE8IYX8AYN/7hDB/kcg4xBv4TBC4kcLgUcv' +
    '4ZBIgJIBHoNgHoJ8BgOGKQMHhijBnkYHoQlEv4DBRYWAv+eOgPwmEDg4mBXIXwni' +
    'SBDwRICSwIABWIM/HoM//57BEoMGv7dC/DrCLoU4eYfAv4kB8f/wPB98HLgP4TQM' +
    'B+EGh0PvE8QwN/+EP8E/LAK6CBIMAwPg+EDDwNgh8GJQP8h8Hz/gN4P+gBMBJIMA'
  ), 48, dec('hEHhAAGA'), 31
];const d10F = [
  dec(
    'AAXgjEAjkHgEDwPAgFwvEAh0f///44CB/ICB/4aDAQMcAQMDwAhBuAhBj0B4EH4E' +
    'wgP4h0Av4JBj3gnEHzkHgPjwF4/Fwh/+CQP/HwMD4E4gJLCvAuBj0ADgOGg+B8fA' +
    'uF5FoMeDQPH/l4vP8g/+vg4BzkAg/gA='
  ), 49, dec('hcMhYA=='), 27
];const d1F = [
  dec(
    'AB1/+AECj///4FCAgP/8EAgf/4F//EAg4CBgf8gEPwAUBn0AhwaCAYMeAoUPgEcA' +
    'oUHAowRFDoopFGopBFJopZGBgIKCAB5BBgA1CAoMBAokDCIgTCAYRTDAoI6CHgU/' +
    'Aol/Aog1GAqgAIhgCBn4CBvjZCLIKMBPIJZBcIMB+4lBMoMD84rDg/HL4cPw4FDj' +
    '5rEnwFEvgFE/AFBaYMB+CJCwED8AFC8EP4CbC/F/wCnC//+H4bbCAoQWBO594EAI' +
    'TBgBrCAQTtBPQUD4EQQwRHBuEAjwuBCQRdBjxOBLoU8j47DvF/Aofz/IFCgPv4IF' +
    'Cgf/EYUPg43BFIUPIYIBBjwnCH4N8ZgT9B/jPCj//+AUBE4P/MoQANnwFETgIACg' +
    'YFEh/uAod/xwQEagQ6B/AFDHIIFCg4hBAoV/JIIFBaAJaDFQgFKFIYFZABN/JAM4' +
    'KYSvBjhICAoLjBd4IPBEgLvBvDjCAIL1BboITBAoc8AogVBAoZ2BDoTnCFIQuBDI' +
    'UeFwIlCnguBGIV4BAIhB4PwCgJJB//gEwJbCwDvCM4LuPC4TjD/4cE//4Fwh/BcY' +
    'K9BIAX/96DCegIJBQYXwTIJxBn+AAoarBAoUBFYIFCgZ9BDoR3CE4LSDE4I1CCoJ' +
    'BDJARNCZoRZDHAQDBDQYABSIQACSIYABDQjACFobABHIaMDIoQADFwSFCFwIEBAo' +
    'N4g4EBAoPwUAIABgPnUonfQgIuC/41Dh5tDEwJGEn46EvhdJACCJDv6VDAYPDJIS' +
    'lB86tCg+B+7HDDALHEnzHEPILpBcILvDAooRFDoopFGopBFJopZFMowAFZgs/VAI' +
    '7BgAbCAoMB/InBAoMD8CkBAoWALIIgBeoJ7DLYYHDPYZbCNoQLDEoYNBGIQjBgI9' +
    'BF4Q4BHYcPJ4JHC/5ZC///fwc/OwkPCAQA=='
  ), 48, dec('ikPigAGA'), 48
];const dowF = [
  dec(
    'gf8AYNwgEP/4FBvEAj//wEAnkAn0H4EAjwNBgPgAoQZBAoMOgHwAongCIQFDDoIF' +
    'FDoPggYFBF4IFBGoI7B+AFCE4NwCIIlCuAdBIYU4gPwn5VBjEA//+M4d//AFDh4W' +
    'BB4IgBAAX/B4n/PoQACJQIcEAokHAqAXFEYhLF/6tCApIADn4ED/zFBAAX8gaGBA' +
    'AZZFQIR2GdQQYRBYgXFEYoWRKQQWCLoRrEHgoAIg7LEj7LEn4bEvk+AodwhwFD+C' +
    '5E8DFEAqIdFFIo1FIIpNFLIoEEAtShCVwQEDVwIFDKAJBvAAv/Bgn/RIjzGjwFEW' +
    'YicBAqAXFEYh6CRIgFKTYzjEAwt/AxxvDHAkf//AAgMDPIgVBGAnwAoYRBIYk/S4' +
    'kDMIgeBFIQEBBYRTBCAZ3FAggAMg4zEj7LEn7LEv++AodzxwFD+ePAofjw4FVDoo' +
    'pFv+eIImcJomYLImAAoZeEAtTyBAAQFEVYIFDSQIvhAojaCFwgABh4YEngFEuAqJ' +
    'gPAAocDApYuEgP/fgl/+B9HAAv+Aon8HQMOIAkeAokcAohaDAoM4Aol4AohmDAoJ' +
    'BDAoJsDAo7vhABZuBQYoFDv4FEYgpjDZRgFYGYYpHGoqxDAAMEAokDdwQbBh//DY' +
    'cf/+ALoU+g/AbIV4gLfDDILrDIIIFD8ARCAoYdBAoodB8EDAoIvBAoI1BHYPwAoQ' +
    'nBuARBEoVwDoJDCnEB+E/KoMYXYP+Wgd//DGDh4WBgEZMoQABnPnAodz4YQCgHjw' +
    'IFP+YXE/IjEeoIFDn//CIanBAoY='
  ), 48, dec('kElkMljsljw='), 48
];const mF = [
  dec(
    '/AEDvEH4AFCgPAnwMDh0B+AGD8EPwAFCg8AvgMDuED8AMEj4MDDwI0DhwOB/4ACC' +
    '4M/AoX8HgIMDCoI0EAAI0EgA0DnACBGgXHL4Q0Bjn+IYXAgfOCwRpBnPHEQmcuAG' +
    'DBg3csAGDj4mCAAX/QwhkBWSEDDIp3BAoZ3BBgkeDIp9FOYQMJDIomGh5NFv/wVo' +
    'YABYIgZBYIYABgKWBHAcPHAKsCgF4VoJDD4AVCIYbtBfAnwgYDBg+Ag6bBEQM8EQ' +
    'KoCDwMDwP9EQI0Bnk9540DZ4Y/CZ4Y0BbggwBDIY0BgP8JIbcB7yBE/pjDEAOQbZ' +
    '8fRwT7DAAL7E/4zEjh9EKwLCEnB9BBhIZFgPzEwkP/jcFe4iYBdYLcEAwr5CBgYj' +
    'Hh65BAxU/AwjNCIhEH/BkEGYqTCRwYMFACE4AonHZ4kcIQkB5yOEnPHIYmcuAMK7' +
    'lgNJJQBJojkBKSB3BDIk/DIkBBgseDIpmEOYwMGDIsAOYkAgxBGGYjzBIwoMDXYI' +
    'tCaAQFCCwP8jiECCwMBBhAZGEwwzHIAxNGTY5UKTYIMEjkORwomEnEHBhQZFgPzT' +
    'gkP/hBEv+ACYivFe3adBAAfwAwoNFGYJkGh/+Axc/AwkfAoggFg/4ZgwzDj4GDiD' +
    '7CAAPxRQswNIp1FBgnH4TPE/0gC4fO8wMDnPHsAMDzl2BhXcsxpFBgZQB+xqE/4z' +
    'DAAMCLRJ3BwaWFBgvjDAkfuAGEu4MFfoYZBW4v/eIn/8CzEvEHBocB4E+BgcOgIn' +
    'DgHgh+ANAcAvgMDuED8AMEj4MDDwI0DhyECAAQXBn4FCf4MBBgYVBGggABGghrBD' +
    'gQqCGgJ0BL4QJBTYJDCBIMBJYRpCJoIAEUIoMGPIgmDVAYMFKgQAODJh3BBgkeDI' +
    'p9FnAMLDIomGh5NFv/we372/exgZDe0BpCDIbBBDIl/EwonBAogMEHIIZDD4KUBH' +
    'wYFDCAPBOwQWCjgMHDI4mGGYwcC+JNFiDAFOIswEAmDDAn8kAME8QYEjwMDAAN2Y' +
    'QtgTonmYQoMDEwP2YQoZEgECJoozEv5NEj/+LQaYB8YMDn0fM4mAu4MDnEHuAMD8' +
    'KVEIAPgEwn+WAuAK4LABj7PDwEAvhJBCwUB8EP8EffQMOgH4C4ITB+EHAYN4RwMA' +
    'ng/BE4PwDYITCnw2BF4YKBF4LwDgInBKYLoFFQIAJgZCBAAZdCTYjOE/p6DgE954' +
    'fEziUDgE544ME7gtEj/OExUP7hAEnJTKAAxuBFoa4BOokfBgkB4AzEniZBewhaEB' +
    'goZGj61BRxMHWQIADjwJCIgLICJQQABDIL9BAAKoBg4iCgYTBKoZABhwnDJoJCDg' +
    '4OCAAQXBewIABJoI5DHQSLBAAP8B4I6CcQgANgbVEOg0fEAkB8KOEnBNBVBIMMjh' +
    'yEWo0MhhSPgJoBwCZDNwp2BJor2LJpjAFAAImEJwI2BAAfwj4GEXYgMBAwKlFv4G' +
    'GFQpYFXQx0BAwx6DLQIGCIIgeCIAkHBgoAPn4FEh/8HQpPEn0fVCPhO4kfZ4hvGg' +
    'YSEgRGFngFEgf4AwkfSws/EwgtBBhQZFEw0cOwIHEuF4AocHWIL2LBgsHGoaBBn7' +
    'SD+DZEnzIFI4MPAoS1CAwbVRTYqoGWosB/p7EnvPD4mcbgk544ME7jcF5wmKh/cI' +
    'Ak5LUvhGYk4VAIfDwBaEBgsB4AZEjkOGYnA4AA=='
  ), 49, dec('k0jk0kksmj0lk8lAwIA='), 52
];
const lockI = dec('hURwMAj0P485w1h3/4g15wFgjPmgOAs+Yg0B//AA');
const lockSI = dec('hMNwMAjkfjHMt/8g1zgOc4FnmEf/AA==');
const batteryI = dec('hERwMAjH/ABw');
const chargeI = dec('g8NwMAgkYsHDh0fw8MmFhwUA');
const HRMI = dec('iERwMAjk4l10t/29/3AIfn+ek6VTlPX9d3/U3/Ef/EP+EH8ED4EBwAA=');
const compassI = dec('hMJwMAhEEg8Dwfh2Pc43BwA=');
const y100I = dec('h8RwMAvk5/n6nOwm9w9lnzH+mO4sc4405xk7jE2mEssEd4EbgE+gE4A=');
const y100sI = dec('hcKwMAsOWvHZ+c2s1s4uYmcD4EwA');

//////////////////////////////////////////////////////////////////////////////
/*                                 Status                                   */

const status = (p, i) => function (g, x, y, rl) { // Nested arrows are currently broken!
    if (!p()) return x;
    if (rl) x -= imageWidth(i);
    g.setColor(g.theme.fg).drawImage(i, x, y);
    return rl ? x - 1 : x + imageWidth(i) + 1;
};

const doLocked = status(_ => Bangle.isLocked(), lockI);
const doPower = (g, x, y, rl) => {
    const c = Bangle.isCharging();
    const b = E.getBattery();
    if (!c && b > 50) return x;
    if (rl) x -= imageWidth(batteryI);
    g.setColor(g.theme.fg).drawImage(batteryI, x, y);
    g.setColor(b <= 10 ? '#f00' : b <= 30 ? '#ff0' : '#0f0');
    let h = 13 * (100 - b) / 100;
    g.fillRect(x + 1, y + 2 + h, x + 6, y + 15);
    if (c) g.setColor(g.theme.bg).drawImage(chargeI, x, y + 2);
    return rl ? x - 1 : x + imageWidth(batteryI) + 1;
};

const doHRM = status(_ => Bangle.isHRMOn(), HRMI); // Might show Bangle.getHRM().bpm if confident?

//////////////////////////////////////////////////////////////////////////////
/*                              Watch face                                  */

class Round {
    constructor(g) {
        this.g = g;
        this.b = Graphics.createArrayBuffer(g.getWidth(), g.getHeight(), 1, {msb: true});
        this.bI = {
            width: this.b.getWidth(), height: this.b.getHeight(), bpp: this.b.getBPP(),
            buffer: this.b.buffer, transparent: 0
        };
        this.c = Graphics.createArrayBuffer(g.getWidth(), g.getHeight(), 1, {msb: true});
        this.cI = {
            width: this.c.getWidth(), height: this.c.getHeight(), bpp: this.c.getBPP(),
            buffer: this.c.buffer, transparent: 0
        };
        this.options = new RoundOptions();
        this.timescales = [1000, [1000, 60000], 60000, 900000];
        this.state = {};
        // Precomputed polygons for the border areas.
        this.tl = [0, 0, 58, 0, 0, 58];
        this.tr = [176, 0, 176, 58, 119, 0];
        this.bl = [0, 176, 0, 119, 58, 176];
        this.br = [176, 176, 119, 176, 176, 119];
        this.xc = g.getWidth() / 2;
        this.yc = g.getHeight() / 2;
        this.minR = 5;
        this.secR = 3;
        this.r = this.xc - this.minR;
    }

    reset(clear) {this.state = {}; clear == null || this.g.clear(true).setRotation(clear);}

    doIcons(which) {
      this.state[which] = null;
    }

    enhanceUntil(t) {this.enhance = t;}

    pie(f, a0, a1, invert) {
        if (!invert) return this.pie(f, a1, a0 + 1, true);
        const t0 = Math.tan(a0 * 2 * Math.PI), t1 = Math.tan(a1 * 2 * Math.PI);
        let i0 = Math.floor(a0 * 4 + 0.5), i1 = Math.floor(a1 * 4 + 0.5);
        const x = f.getWidth() / 2, y = f.getHeight() / 2;
        const poly = [
            x + (i1 & 2 ? -x : x) * (i1 & 1 ? 1 : t1),
            y + (i1 & 2 ? y : -y) / (i1 & 1 ? t1 : 1),
            x,
            y,
            x + (i0 & 2 ? -x : x) * (i0 & 1 ? 1 : t0),
            y + (i0 & 2 ? y : -y) / (i0 & 1 ? t0 : 1),
        ];
        if (i1 - i0 > 4) i1 = i0 + 4;
        for (i0++; i0 <= i1; i0++) poly.push(
            3 * i0 & 2 ? f.getWidth() : 0, i0 & 2 ? f.getHeight() : 0
        );
        return f.setColor(0).fillPoly(poly);
    }
    
    hand(t, d, c0, r0, c1, r1) {
        const g = this.g;
        t *= Math.PI / 30;
        const r = this.r,
              z = 2 * r0 + 1,
              x = this.xc + r * Math.sin(t), y = this.yc - r * Math.cos(t),
              x0 = x - r0, y0 = y - r0;
        d = d ? d[0] : Graphics.createArrayBuffer(z, z, 4, {msb: true});
        for (let i = 0; i < z; i++) for (let j = 0; j < z; j++) {
          d.setPixel(i, j, g.getPixel(x0 + i, y0 + j));
        }
        g.setColor(c0).fillCircle(x, y, r0);
        if (c1 !== undefined) g.setColor(c1).fillCircle(x, y, r1);
        return [d, x0, y0];
    }

    render(d, rate) {
        const g = this.g, b = this.b, bI = this.bI, c = this.c, cI = this.cI,
              e = d < this.enhance,
              state = this.state, options = this.options,
              cal = options.calendric, res = options.resolution,
              dow = (e || cal === 1 || cal > 2) && d.getDay(),
              ts = res < 2 && d.getSeconds(),
              tm = (e || res < 3) && d.getMinutes() + ts / 60,
              th = d.getHours() + d.getMinutes() / 60,
              dd = (e || cal > 1) && d.getDate(),
              dm = (e || cal > 3) && d.getMonth(),
              dy = (e || cal > 4) && d.getFullYear();
        const xc = this.xc, yc = this.yc, r = this.r,
              dlr = xc * 3/4, dlw = 8, dlhw = 4;

        // Restore saveunders for fast-moving, overdrawing indicators.
        if (state.sd) g.drawImage.apply(g, state.sd);
        if (state.md) g.drawImage.apply(g, state.md);

        if (dow !== state.dow) {
            g.setColor(g.theme.bg).fillPoly(this.tl);
            if (dow === +dow) {
                g.setColor(g.theme.fg).setFontCustom.apply(g, dowF).drawString(dow, 5, 5);
            }
            state.dow = dow;
        }

        const locked = Bangle.isLocked(),
              charging = Bangle.isCharging(),
              battery = E.getBattery(),
              HRMOn = Bangle.isHRMOn();
        if (dy !== state.dy ||
            locked !== state.locked ||
            charging !== state.charging ||
            Math.abs(battery - state.battery) > 2 ||
            HRMOn !== state.HRMOn
           ) {
            g.setColor(g.theme.bg).fillPoly(this.tr);
            const u = dy % 10;
            if (charging || battery < 50 || HRMOn || locked && dy !== +dy) {
                let x = 172, y = 5;
                x = doLocked(g, x, y, true);
                x = doPower(g, x, y, true);
                x = doHRM(g, x, y, true);
                if (dy === +dy) {
                    g.setColor(g.theme.fg).drawImage(y100sI, 145, 23);
                    g.setFontCustom.apply(g, y10sF).drawString((dy - u) / 10 % 10, 157, 23);
                    g.setFontCustom.apply(g, y1sF).drawString(u, 165, 23);
                }
            } else if (dy === +dy) {
                g.setColor(g.theme.fg);
                if (locked) g.drawImage(lockSI, 136, 5);
                else g.drawImage(y100I, 130, 5);
                g.setFontCustom.apply(g, y10F).drawString((dy - u) / 10 % 10, 146, 5);
                g.setFontCustom.apply(g, y1F).drawString(u, 160, 5);
            }
            state.dy = dy;
            state.locked = Bangle.isLocked();
            state.charging = Bangle.isCharging();
            state.battery = E.getBattery() - E.getBattery() % 2;
            state.HRMOn = Bangle.isHRMOn();
        }
        if (dm !== state.dm) {
            g.setColor(g.theme.bg).fillPoly(this.bl);
            if (dm === +dm) {
                g.setColor(g.theme.fg).setFontCustom.apply(g, mF);
                g.drawString(String.fromCharCode(49 + dm), 5, 124);
            }
            state.dm = dm;
        }
        if (dd !== state.dd) {
            g.setColor(g.theme.bg).fillPoly(this.br);
            if (dd === +dd) {
                let u = dd % 10;
                g.setColor(g.theme.fg).setFontAlign(1, 1);
                g.setFontCustom.apply(g, d10F).drawString((dd - u) / 10, 152, 172);
                g.setFontAlign(-1, 1);
                g.setFontCustom.apply(g, d1F).drawString(u, 152, 172);
                g.setFontAlign(-1, -1);
            }
        }
        if (th !== state.th) {
            state.th = th;
            b.clear(true).fillCircle(88, 88, r - 1);
            g.setColor(options.nightFg).drawImage(bI);
            if (th < 12) this.pie(b, th / 12, 1, true);
            else this.pie(b, 1, th / 12, true);
            g.setColor(options.dayFg).drawImage(bI);
        }
        state.md = tm === +tm ?
            this.hand(tm, state.md, g.theme.bg, this.minR, g.theme.fg, this.minR - 1) :
            null;
        state.sd = ts === +ts ?
            rate > 1000 ? this.hand(ts, state.sd, g.theme.fg2, this.secR, g.theme.bg, 2) :
            this.hand(ts, state.sd, g.theme.fg2, this.secR) :
            null;
    }
}

//////////////////////////////////////////////////////////////////////////////
/*                             Master clock                                 */

class Clock {
    constructor(face) {
        this.face = face;
        this.timescales = face.timescales;
        this.options = face.options;
        this.rates = {};

        this.options.on('done', () => this.start());
        
        this.listeners = {
            lcdPower: on => on ? this.active() : this.inactive(),
            charging: on => {
                face.doIcons('charging');
                if (on) {
                    this.listeners.accel =
                        a => this.orientation(a) === this.attitude || this.active();
                    Bangle.on('accel', this.listeners.accel);
                } else {
                    Bangle.removeListener('accel', this.listeners.accel);
                    delete this.listeners.accel;
                }
                this.active();
            },
            lock: () => {face.doIcons('locked'); this.active();},
            faceUp: up => {
                this.conservative = !up;
                this.active();
            },
            twist: _ => this.options.autolight && Bangle.setLCDPower(true),
            drag: e => {
                if (this.t0) {
                    if (e.b) {
                        e.x < this.xN && (this.xN = e.x) || e.x > this.xX && (this.xX = e.x);
                        e.y < this.yN && (this.yN = e.y) || e.y > this.yX && (this.yX = e.y);
                    } else if (this.xX - this.xN < 20) {
                        if (e.y - this.e0.y < -50) {
                            this.options.resolution > 0 && this.options.resolution--;
                            this.rates.clock = this.timescales[this.options.resolution];
                            this.ack();
                            this.active();
                        } else if (e.y - this.e0.y > 50) {
                            this.options.resolution < this.timescales.length - 1 &&
                                this.options.resolution++;
                            this.rates.clock = this.timescales[this.options.resolution];
                            this.ack();
                            this.active();
                        } else if (this.yX - this.yN < 20) {
                            const now = new Date();
                            if (now - this.t0 < 250) {
                                this.ack();
                                face.enhanceUntil(now + 30000);
                                this.active();
                            } else if (now - this.t0 > 500) {
                                this.stop();
                                this.ack().then(_ => this.options.interact());
                            }
                        }
                        this.t0 = null;
                    }
                } else if (e.b) {
                    this.t0 = Date.now(); this.e0 = e;
                    this.xN = this.xX = e.x; this.yN = this.yX = e.y;
                }
            }
        };
    }

    ack() {
        return Bangle.buzz(33);
    }

    orientation(a) {
        return Math.abs(a.z) < 0.85 ?
            Math.abs(a.y) > Math.abs(a.x) ? a.y < 0 ? 0 : 2 : a.x > 0 ? 1 : 3 :
        0;
    }
    
    rotation() {
        return this.options.autorotate && Bangle.isCharging() ?
            this.orientation(Bangle.getAccel()) :
            0;
    }
    
    redraw(rate) {
        const now = this.updated = new Date();
        if (this.refresh) this.face.reset(this.attitude = this.rotation());
        this.refresh = false;
        rate = this.face.render(now, rate);
        if (rate !== this.rates.face) {
            this.rates.face = rate;
            this.active();
        }
        return this;
    }

    inactive() {
        this.timeout && clearTimeout(this.timeout);
        this.exception && clearTimeout(this.exception);
        this.interval && clearInterval(this.interval);
        this.timeout = this.exception = this.interval = this.rate = null;
        this.face.reset(); // Cancel any ongoing background rendering
        return this;
    }
    
    active() {
        const prev = this.rate,
              now = Date.now();
        let rate = Infinity;
        for (const k in this.rates) {
            let r = this.rates[k];
            r === +r || (r = r[+this.conservative])
            r < rate && (rate = r);
        }
        const delay = rate - now % rate + 1;
        this.refresh = true;
        
        if (rate !== prev) {
            this.inactive();
            this.redraw(rate);
            if (rate < 31622400000) { // A year!
                this.timeout = setTimeout(
                    () => {
                        this.inactive();
                        this.interval = setInterval(() => this.redraw(rate), rate);
                        if (delay > 1000) this.redraw(rate);
                        this.rate = rate;
                    }, delay
                );
            }
        } else if (rate > 1000) {
            if (!this.exception) this.exception = setTimeout(() => {
                this.redraw(rate);
                this.exception = null;
            }, this.updated + 1000 - Date.now());
        }
        return this;
    }

    stop() {
        this.inactive();
        for (const l in this.listeners) {
            Bangle.removeListener(l, this.listeners[l]);
        }
        return this;
    }

    start() {
        this.inactive(); // Reset to known state.
        this.conservative = false;
        this.rates.clock = this.timescales[this.options.resolution];
        this.active();
        for (const l in this.listeners) {
            Bangle.on(l, this.listeners[l]);
        }
        Bangle.setUI('clock');
        return this;
    }
}

//////////////////////////////////////////////////////////////////////////////
/*                                   Main                                   */

const clock = new Clock(new Round(g)).start();
