$(function() {
    var Validator = function(op) {
            var config = {
                authValidations: []
            };
            if (op.config) {
                if ('authValidations' in op.config) {
                    config.authValidations = op.config.authValidations
                }
            }
            return {
                recaptcha: function() {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    var response = grecaptcha.getResponse();
                    if (!response.length) {
                        val.messageError += "\n     -  Captcha no verificado";
                        val.validation = false;
                    }
                    return val;
                },
                conditions: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('conditions') >= 0) {
                        selector = selector ? selector : '[name="conditions"]';
                        if (!$form.find(selector).is(':checked')) {
                            val.messageError = "\n     -  Debe aceptar los términos y condiciones";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                code: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    
                    selector = selector ? selector : '#code';
                    var code = $form.find(selector).val();
                    if (!code) {
                        val.messageError += "\n     -  El codigo esta vacio";

                    } 
                    if (val.messageError)  {
                        val.validation = true;
                    }
                    
                    return val;
                },
                name: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('name') >= 0) {
                        selector = selector ? selector : '#name';
                        var name = $form.find(selector).val();
                        if (!name) {
                            val.messageError = "\n     -  El nombre está vacio";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                email: function($form, selector, selector2) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    
                    selector = selector ? selector : '#email';
                    selector2 = selector2 ? selector2 : '#email_confirm';
                    var email = $form.find(selector).val();
                    var email_confirm = $form.find(selector2).val();
                    if (!email) {
                        val.messageError += "\n     -  Correo electrónico está vacio";
                    } else if (email != email_confirm) {
                        val.messageError += "\n     -  Correo de confirmación no coincide";
                    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                        val.messageError += "\n     -  Correo electrónico incorrecto";
                    }
                    if (val.messageError)  {
                        val.validation = false;
                    }
                    
                    return val;
                },
                recharge: function($form, selector, selector2) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    
                    selector = selector ? selector : '#telephone_number';
                    selector2 = selector2 ? selector2 : '#telephone_number2';
                    var cellphone = $form.find(selector).val();
                    if (!cellphone) {
                        val.messageError += "\n     -  Teléfono está vacio";
                    } 
                    else if (!/^[0-9]{10}$/.test(cellphone)) {
                        val.messageError += "\n     -  Teléfono incorrecto";
                    } 
                    else if ($form.find(selector2).length) {
                        var cellphone_confirm = $form.find(selector2).val();
                        if (cellphone != cellphone_confirm) {
                            val.messageError += "\n     -  Telefono de confirmación no coincide";
                        }
                    }
                    if (val.messageError)  {
                        val.validation = false;
                        }
                    
                    return val;
                },
                not_empty: function($form, selector, label) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (selector) {
                        var field = $form.find(selector).val();
                        if (!field) {
                            val.messageError = "\n     -  El campo " + label + " está vacio";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                all: function($form) {
                    var missinginfo = '';

                    missinginfo += this.code($form, '#code').messageError +
                        this.recaptcha().messageError +
                        this.conditions($form, '[name="conditions"]').messageError;

                    if (missinginfo) {
                        swal({
                            title: "Verifique datos!",
                            text: missinginfo,
                            icon: "info"
                        });
                        return false;
                    } else {
                        return true;
                    }
                },
                form_update: function($form) {
                    var missinginfo = '';

                    missinginfo += this.email($form, '#email', '#email_confirm').messageError +
                        this.not_empty($form, '#name', 'nombre').messageError +
                        this.not_empty($form, '#lastname', 'apellidos').messageError +
                        this.not_empty($form, '#mun', 'municipio').messageError +
                        this.not_empty($form, '#state', 'estado').messageError;

                    if (missinginfo) {
                        swal({
                            title: "Verifique datos!",
                            text: missinginfo,
                            icon: "info"
                        });
                        return false;
                    } else {
                        return true;
                    }
                },
                form_carrier: function($form) {
                    var missinginfo = '';

                    missinginfo += this.not_empty($form, '#company', 'Compañía telefónica').messageError +
                        this.recharge($form, '#telephone_number', '#telephone_number2').messageError;

                    if (missinginfo) {
                        swal({
                            title: "Verifique datos!",
                            text: missinginfo,
                            icon: "info"
                        });
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        };
    (function() {

        function init(site) {

            const http = new HttpClient(API_URL[ENV]);
            const validation = new Validator(site);
            const token_label = ['s', site.id, "token"].join(':');
            const user_label = ['s', site.id, "user"].join(':');
            const pathname = window.location.pathname,
                home = '/';
            
            const redirect = function(user_data) {
                    if (typeof user_data.digital != "undefined") {
                        window.location.href = './app-form' + (ENV ? '.php' : '');
                    } else if (pathname) {
                        window.location.href = home;
                    }
                },
                getToken = function() {
                    return localStorage.getItem(token_label);
                },
                getUser = function() {
                    var user = localStorage.getItem(user_label);
                    return user ? JSON.parse(user) : false;
                },
                logout = function() {
                    localStorage.removeItem(token_label);
                    localStorage.removeItem(user_label);
                    window.location.href = home;
                },
                without_recharging = function(user) {
                    if (user.record) {
                        return !user.record.rchrg_id;
                    }
                    return true;
                },
                errorAlerts = function(error) {
                    if (error) {
                        if (error.error) {
                            if (typeof error.error === 'string') {
                                if (error.error.indexOf('Invalid API key') >= 0) {
                                    invalidApiKey(error.error);
                                } else {
                                    swal({
                                        title: "¡Atención!",
                                        text: error.error,
                                        icon: "info"
                                    });
                                }
                            } else {
                                swal({
                                    title: "¡Atención!",
                                    text: [error.error.error_code,
                                        error.error.description
                                    ].join(':'),
                                    icon: "info"
                                });
                            }
                        }
                    }
                },
                invalidApiKey = function(error) {
                    swal({
                        title: "Atención!",
                        text: 'Su session a finalizado, por favor intente nuevamente [' + error + ']',
                        icon: "info"
                    }).then(() => {
                        logout();
                    });
                },
                formatDate = function(date) {
                    var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
                        f = new Date(date);
                    return [f.getDate(), 'de', months[f.getMonth()], 'de', f.getFullYear()].join(' ');
                },
                carrier_page = function(user) {
                    var token = getToken();
                    if (token) {
                        $('.label-carrier' ).css( 'display','inline-block');
                        if(user.options && user.options.carriers) {
                            var carriersAvailable = user.options.carriers,
                            allCarriers = ['movistar', 'telcel', 'ina', 'unefon', 'virgin'];

                            if (carriersAvailable.length === 1) {
                                $('#' + carriersAvailable[0]).css( 'display','none');
                                $("#company").val(carriersAvailable[0]);
                                $(".label-carrier").text('REALIZA TU RECARGA');

                            }
                            jQuery.each(allCarriers, function(i, val) {
                                if (carriersAvailable.indexOf(val) < 0) {
                                    $('div').remove('.' + val);
                                }
                            });

                        }
                        $('.block-carrier' ).css( 'display','flex');

                        $('[name="company"]').on('input', function(e) {
                            if ($(this).is(':checked')) {
                                $('#company').val($(this).data('company'));
                            }
                        });

                        $('.company').click(function() {
                            const data = $(this).data('company');
                            $('.company').each(function() {
                                if ($(this).data('company') == data) {
                                    $('#company').val(data);
                                    $('#telephone_number').focus();
                                }
                            });
                        });

                        $("form.carrier-form").submit(function(event) {
                            event.preventDefault();
                            var $btn = $(this).find('button[type=submit],input[type=submit]');
                            var $cellphone = $(this).find('#telephone_number'),
                                $company = $(this).find('#company');
                            var valForm = validation.form_carrier($(this));
                            if (valForm) {
                                $btn.prop('disabled', true).html('ENVIANDO...');
                                http.put('/sites/record', {
                                        'client': site.slug,
                                        'info': {
                                            'cellphone': $cellphone.val(),
                                            'cellphone_company': $company.val()
                                        }
                                    }, {
                                        'X-API-KEY': token
                                    })
                                    .done(function(data) {
                                        if (data.data) {
                                            var req = data.data;
                                            var error = function(texto) {
                                                swal({
                                                    title: !texto ? "Algo está mal!" : texto,
                                                    icon: "error"
                                                });
                                            };
                                            if (token && without_recharging(user)) {
                                                http.get(['/sites', site.slug, 'download'].join('/'), {
                                                    'rchrg_cellphone': $('#telephone_number').val(),
                                                    'rchrg_company': $('#company').val()
                                                    }, {
                                                        'X-API-KEY': token
                                                    })
                                                    .done(function(data) {
                                                        var req_source = data.data;
                                                        if (req_source) {
                                                            if (req_source.sources.recharges.length) {
                                                                if (req_source.sources.recharges[0]) {
                                                                    window.location.href = './congratulation-recarga' + (ENV ? '.php' : '');
                                                                } else error("Hubo un error con su recarga, revise sus datos y vuelva a intentarlo más tarde.");
                                                            } else error();
                                                        } else error();
                                                    })
                                                    .fail(function(jqXHR, textStatus, errorThrown) {
                                                        errorAlerts(jqXHR.responseJSON);
                                                    });
                                            } else {
                                                error("Este cupón ya ha sido usado!");
                                            }
                                        }
                                    })
                                    .fail(function(jqXHR, textStatus, errorThrown) {
                                        errorAlerts(jqXHR.responseJSON);
                                    })
                                    .always(function() {
                                        $('input[type=text], input[type=tel]').val('');
                                        $btn.prop('disabled', false).html('CONTINUAR');
                                    });
                            }
                        });
                    }
                };
            
            var form_complete = function() {
                var user = getUser();
                if (user.digital.type === 'rchrg') {
                    window.location.href = './app-carrier' + (ENV ? '.php' : '');
                } else if(user.digital.name.indexOf('STARBUCKS') >= 0) {
                    window.location.href = './app-download-sbk' + (ENV ? '.php' : '');
                } else {
                    window.location.href = './app-download' + (ENV ? '.php' : '');
                }
            }


            if (pathname != home && !localStorage.getItem(token_label)) {
                window.location.href = home;
            } else {
                if (site.promo_ends) {
                    $('.site_promo_ends').html(formatDate(site.promo_ends));
                }
                var user = getUser();
                if (user) {
                    if (user.valid_date) {
                        $('.valid_date_day').html(user.valid_date.day);
                        $('.valid_date_hour').html(user.valid_date.hour);
                    }
                    if (user.record) {
                        $('.user_name').html(user.record.name);
                        $('.user_email').html(user.record.email);
                    }
                    const path = pathname.split('/');
                    const page = path[path.length-1];
                    switch (page) {
                      case 'app-form':
                      case 'app-form.php':
                        break;
                      case 'app-carrier':
                      case 'app-carrier.php':
                            carrier_page(user);
                        break;
                    }
                    if (user.record.email) {
                        $('.user_email').html(user.record.email);
                    }
                }
                if (pathname == home || pathname == (home + '/index.php')) {
                    localStorage.removeItem(token_label);
                    localStorage.removeItem(user_label);
                }
            }


            // auth request
            $("form.qrewards-auth").submit(function(event) {
                event.preventDefault();
                var $btn = $(this).find('button[type=submit],input[type=submit]');
                var valForm = validation.all($(this));
                if (valForm) {
                    var code = $(this).find('#code');
                    $btn.prop('disabled', true).html('ENVIANDO...');
                    http.get('/sites/' + site.slug + '/auth/' + encodeURIComponent(code.val()), $(this).serialize())
                        .done(function(data) {
                            if (data.data) {
                                var req = data.data;
                                localStorage.setItem(token_label, req.token);
                                localStorage.setItem(user_label, JSON.stringify(req.user));
                                redirect(req.user);
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            errorAlerts(jqXHR.responseJSON);
                        })
                        .always(function() {
                            code.val('').focus();
                            grecaptcha.reset();
                            $btn.prop('disabled', false).html('CONTINUAR');
                        });
                        
                }
            });

            // Update user info
            $("form.qrewards-form").submit(function(event) {
                event.preventDefault();
                var token = getToken();
                var $name = $(this).find('#name'),
                    $lastname = $(this).find('#lastname'),
                    $town = $(this).find('#mun'),
                    $state = $(this).find('#state'),
                    $email = $(this).find('#email');
                var valForm = validation.form_update($(this));
                if (valForm) {
                    if (token) {
                        http.put('/sites/record', {
                                'client': site.slug,
                                'name': [$name.val(), $lastname.val()].join(' '),
                                'info': {
                                    'name': $name.val(),
                                    'lastname': $lastname.val(),
                                    'town': $town.val(),
                                    'state': $state.val()
                                },
                                'email': $email.val()
                            }, {
                                'X-API-KEY': token
                            })
                            .done(function(data) {
                                var req = data.data;
                                if (req) {
                                    var user = getUser();
                                    user.record.name = req.rows.name;
                                    user.record.email = req.rows.email;
                                    localStorage.setItem(user_label, JSON.stringify(user));
                                    form_complete();
                                }
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                if (typeof jqXHR.responseJSON.error.error_code === 'undefined') {
                                    invalidApiKey(jqXHR.responseJSON.error);
                                } else {
                                    swal({
                                        title: "Error!",
                                        text: [jqXHR.responseJSON.error.error_code,
                                            jqXHR.responseJSON.error.description
                                        ].join(':'),
                                        icon: "error"
                                    });
                                }
                            })
                            .always(function() {
                                $("form.qrewards-form").find('input, select').first().focus();
                            });
                    } else {
                        swal({
                            title: 'Error!',
                            text: 'Error al intentar obtener token de autenticación',
                            icon: 'error'
                        });
                        window.location.href = home;
                    }
                }
            });

            $(".btn-printer").click(function(event) {
                event.preventDefault();
                var $btn = $(this).find('button[type=submit],input[type=submit]');
                var token = getToken();
                if (token) {
                    $btn.prop('disabled', true).html('DESCARGANDO...');
                    http.get(['/sites', site.slug, 'download'].join('/'), {}, {
                            'X-API-KEY': token
                        })
                        .done(function(data) {
                            var req = data.data;
                            if (req) {
                                var url_coupon = API_URL[ENV] + '/public/pdf/dompdf.php?i=' + req.sources.media;
                                if (req.device_os_mobile || ENV === 1) {
                                    window.location.replace(url_coupon);
                                } else {
                                    $('#container-iframe').attr('src', url_coupon);
                                }
                            } else {
                                swal({
                                    title: "Algo está mal!",
                                    icon: "info"
                                });
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            if (typeof jqXHR.responseJSON.error.error_code === 'undefined') {
                                invalidApiKey(jqXHR.responseJSON.error);
                            } else if (jqXHR.responseJSON.error.error_code < 2000) {
                                swal({
                                    title: "Error!",
                                    text: [jqXHR.responseJSON.error.error_code,
                                        jqXHR.responseJSON.error.description
                                    ].join(':'),
                                    icon: "info"
                                });
                            } else {
                                swal({
                                    title: "Atención!",
                                    text: jqXHR.responseJSON.error.description + '.',
                                    icon: "info"
                                }).then(() => {
                                    logout();
                                });
                            }
                        })
                        .always(function() {
                            $btn.prop('disabled', false).html('Imprime tu cupón');
                        });
                }
            });

            $(".btn-logout").click(function(event) {
                event.preventDefault();
                logout();
            });
        }
        window.init = init;
    })();
    
});
$(document).ready(function() {
    if (slug_site) {
        $.get(API_URL[ENV] + '/sites/' + slug_site + '/info', function(data) {
            if (data.data) {
                init(data.data);
            }
        });
    } else {
        alert('Error al cargar página!');
    }
});