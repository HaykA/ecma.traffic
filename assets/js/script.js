/**
 * Created by Hayk on 5/04/2017.
 */

var $ROAD = $('.road');
var $H_CARS = $('.street-h .tlight-cars');
var $H_PEOPLE = $('.street-h .tlight-people');
var $V_CARS = $('.street-v .tlight-cars');
var $V_PEOPLE =  $('.street-v .tlight-people');
var $EVERYONE = $('.street .tlight');

var IRQ_LIST = [];

var TRIGGER = {
    allowHCars: 'allow.hcars',
    allowVCars: 'allow.vcars',
    warnHCars: 'warn.hcars',
    warnVCars: 'warn.vcars',
    stopHCars: 'stop.hcars',
    stopVCars: 'stop.vcars',
    allowHPeople: 'allow.hpeople',
    allowVPeople: 'allow.vpeople',
    stopHPeople: 'stop.hpeople',
    stopVPeople: 'stop.vpeople'
};

var DURATION = {
    allowCars: 5000,
    warnCars: 3000,
    holdOn: 2000,
    allowPeople: 5000,
    interrupt: 1500
};

var triggerTimer = function (event, duration) {
    if (IRQ_LIST != undefined && IRQ_LIST.length > 0
        && (event == TRIGGER.allowHPeople
        || event == TRIGGER.allowVPeople
        || event == TRIGGER.allowHCars
        || event == TRIGGER.allowVCars)) {
        event = IRQ_LIST[0];
        IRQ_LIST = IRQ_LIST.slice(1, IRQ_LIST.length);
    }
    window.setTimeout(function () {
        trigger(event);
    }, duration);
};

var trigger = function (evt) {
    var event = jQuery.Event(evt);
    $ROAD.trigger(event);
};

var warn = function ($jqo) {
    var event = jQuery.Event('orange');
    $jqo.trigger(event);
};

var stop = function ($jqo) {
    var event = jQuery.Event('red');
    $jqo.trigger(event);
};

var resetEveryone = function ($redRemainer) {
    $EVERYONE.find('div').removeClass('active');
    $EVERYONE.find('.red').addClass('active');
    if ($redRemainer != undefined) {
        $redRemainer.find('.red').removeClass('active');
    }
};

var allowHCars = function (e) {
    resetEveryone($H_CARS);
    $H_CARS.find('.green').addClass('active');
    triggerTimer(TRIGGER.warnHCars, DURATION.allowCars);
};

var allowVCars = function (e) {
    resetEveryone($V_CARS);
    $V_CARS.find('.green').addClass('active');
    triggerTimer(TRIGGER.warnVCars, DURATION.allowCars);
};

var warnHCars = function (e) {
    resetEveryone($H_CARS);
    $H_CARS.find('.orange').addClass('active');
    triggerTimer(TRIGGER.stopHCars, DURATION.warnCars);
};

var warnVCars = function (e) {
    resetEveryone($V_CARS);
    $V_CARS.find('.orange').addClass('active');
    triggerTimer(TRIGGER.stopVCars, DURATION.warnCars);
};

var stopHCars = function (e) {
    resetEveryone();
    triggerTimer(TRIGGER.allowHPeople, DURATION.holdOn);
};

var stopVCars = function (e) {
    resetEveryone();
    triggerTimer(TRIGGER.allowVPeople, DURATION.holdOn);
};

var allowHPeople = function (e) {
    resetEveryone($H_PEOPLE);
    $H_PEOPLE.find('.green').addClass('active');
    triggerTimer(TRIGGER.stopHPeople, DURATION.allowPeople);
};

var allowVPeople = function (e) {
    resetEveryone($V_PEOPLE);
    $V_PEOPLE.find('.green').addClass('active');
    triggerTimer(TRIGGER.stopVPeople, DURATION.allowPeople);
};

var stopHPeople = function (e) {
    resetEveryone();
    triggerTimer(TRIGGER.allowVCars, DURATION.holdOn);
};

var stopVPeople = function (e) {
    resetEveryone();
    triggerTimer(TRIGGER.allowHCars, DURATION.holdOn);
};

var iRQH = function (e) {
    var irq = TRIGGER.allowHPeople;
    if (!IRQ_LIST.includes(irq)) {
        IRQ_LIST.push(irq);
    }
};

var iRQV = function (e) {
    var irq = TRIGGER.allowVPeople;
    if (!IRQ_LIST.includes(irq)) {
        IRQ_LIST.push(irq);
    }
};

var init = function () {
    $ROAD.on(TRIGGER.allowHCars, allowHCars)
        .on(TRIGGER.allowVCars, allowVCars)
        .on(TRIGGER.warnHCars, warnHCars)
        .on(TRIGGER.warnVCars, warnVCars)
        .on(TRIGGER.stopHCars, stopHCars)
        .on(TRIGGER.stopVCars, stopVCars)
        .on(TRIGGER.allowHPeople, allowHPeople)
        .on(TRIGGER.allowVPeople, allowVPeople)
        .on(TRIGGER.stopHPeople, stopHPeople)
        .on(TRIGGER.stopVPeople, stopVPeople);
    $('.street-h .allow-people').on('click', iRQH);
    $('.street-v .allow-people').on('click', iRQV);
    trigger('allow.hcars');
};

$(document).ready(init);