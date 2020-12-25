function hasBad(obj, mixins, toplevel = "") {
    let child = new Set(['item.hookshot', 'item.bow', 'item.hammer', 'item.cojiro', 'item.arrow_fire',
        'item.arrow_ice', 'item.arrow_light', 'item.sword_biggoron', 'item.shield_mirror', 'item.tunic_fire',
        'item.tunic_water', 'item.boots_iron', 'item.boots_hover']);
    let adult = new Set(['item.boomerang', 'item.stick', 'item.slingshot', 'item.sword_kokiri', 'item.shield_kokiri']);

    if(mixins.has(obj.el))
        return true

    if(child.has(obj.el) && toplevel.endsWith("[child]"))
        return true

    if(adult.has(obj.el) && toplevel.endsWith("[adult]"))
        return true

    return false
}


export function filterFailedMixins(data) {
    let [logic, mixins] = data;
    let res = logic;

    for(const topLevel in res.edges) {
        let one = res.edges[topLevel]
        /*delObj(one, mixins)
        orFix(one);*/
        if(typeof one === "object"){
            for(const level in one) {
                let two = one[level];
                let deleteTwo = false

                if(typeof two === "object") {
                    for(const level in two) {
                        let three = two[level]
                        let deleteThree = false

                        if(typeof three === "object") {
                            for(const level in three) {
                                let four = three[level]
                                let deleteFour = false

                                if(typeof four === "object") {
                                    for(const level in four) {
                                        let five = four[level]
                                        let deleteFive = false

                                        if(typeof five === "object") {
                                            for(const level in five) {
                                                let six = five[level]
                                                let deleteSix = false

                                                if(typeof six === "object") {
                                                    for(const level in six) {
                                                        let seven = six[level]
                                                        let deleteSeven = false

                                                        if(typeof seven === "object") {
                                                            for(const level in seven) {
                                                                let eight = seven[level]
                                                                let deleteEight = false

                                                                if(typeof eight === "object") {
                                                                    for(const level in eight) {
                                                                        let nine = eight[level]
                                                                        let deleteNine = false

                                                                        if(typeof nine === "object") {
                                                                            for(const level in nine) {
                                                                                let ten = nine[level]
                                                                                let deleteTen = false

                                                                                if(typeof ten === "object") {
                                                                                    for(const level in ten) {
                                                                                        let eleven = ten[level]
                                                                                        let deleteEleven = false

                                                                                        if(typeof eleven === "object") {
                                                                                            for(const level in eleven) {
                                                                                                let twelve = eleven[level]
                                                                                                let deleteTwelve = false

                                                                                                if(typeof twelve === "object") {
                                                                                                    for(const level in twelve) {
                                                                                                        let thirteen = twelve[level]
                                                                                                        let deleteThirteen = false

                                                                                                        if(typeof thirteen === "object") {
                                                                                                            for(const level in thirteen) {
                                                                                                                let fourteen = thirteen[level]
                                                                                                                let deleteFourteen = false

                                                                                                                if(typeof fourteen === "object") {
                                                                                                                    for(const level in fourteen) {
                                                                                                                        let fifteen = fourteen[level]
                                                                                                                        let deleteFifteen = false

                                                                                                                        if(typeof fifteen === "object") {
                                                                                                                            for(const level in fifteen) {
                                                                                                                                let sixteen = fifteen[level]
                                                                                                                                let deleteSixteen = false

                                                                                                                                if(typeof sixteen === "object") {
                                                                                                                                    for(const level in sixteen) {
                                                                                                                                        let seventeen = sixteen[level]
                                                                                                                                        let deleteSeventeen = false

                                                                                                                                        if(typeof seventeen === "object") {
                                                                                                                                            for(const level in seventeen) {
                                                                                                                                                let eightteen = seventeen[level]
                                                                                                                                                let deleteEightteen = false

                                                                                                                                                if(typeof eightteen === "object") {
                                                                                                                                                    for(const level in eightteen) {
                                                                                                                                                        let nineteen = eightteen[level]
                                                                                                                                                        let deleteNineteen = false

                                                                                                                                                        if(typeof nineteen === "object") {
                                                                                                                                                            for(const level in nineteen) {
                                                                                                                                                                let twenty = nineteen[level]
                                                                                                                                                                let deleteTwenty = false

                                                                                                                                                                if(typeof twenty === "object") {
                                                                                                                                                                    for(const level in twenty) {
                                                                                                                                                                        let twentyone = twenty[level]
                                                                                                                                                                        let deleteTwentyone = false;

                                                                                                                                                                        if(typeof twentyone === "object") {
                                                                                                                                                                            for(const level in twentyone) {
                                                                                                                                                                                let twentytwo = twentyone[level]

                                                                                                                                                                                if(typeof twentytwo === "object") {
                                                                                                                                                                                    if(hasBad(twentytwo, mixins))
                                                                                                                                                                                        delete twentyone[level]
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            if(Array.isArray(twentyone)) {
                                                                                                                                                                                let length = twenty.el.length;
                                                                                                                                                                                twenty[level] = twentyone.filter(value => Object.keys(value).length > 0)
                                                                                                                                                                                if(twenty.type === 'and' && twenty.el.length != length) {
                                                                                                                                                                                    deleteTwenty = true
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            if(hasBad(twentyone, mixins))
                                                                                                                                                                                delete twenty[level]
                                                                                                                                                                            if(twentyone.type === 'or' && twentyone.el.length === 1)
                                                                                                                                                                                twenty[level] = twenty.el[0]
                                                                                                                                                                            /*if(deleteTwentyone)
                                                                                                                                                                                delete twenty[level];*/
                                                                                                                                                                        }

                                                                                                                                                                    }
                                                                                                                                                                    if(Array.isArray(twenty)) {
                                                                                                                                                                        let length = nineteen.el.length;
                                                                                                                                                                        nineteen[level] = twenty.filter(value => Object.keys(value).length > 0)
                                                                                                                                                                        if(nineteen.type === 'and' && nineteen.el.length != length) {
                                                                                                                                                                            deleteNineteen = true
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                    if(hasBad(twenty, mixins))
                                                                                                                                                                        delete nineteen[level]
                                                                                                                                                                    if(twenty.type === 'or' && twenty.el.length === 1)
                                                                                                                                                                        nineteen[level] = twenty.el[0]
                                                                                                                                                                    /*if(deleteTwenty)
                                                                                                                                                                        delete nineteen[level];*/
                                                                                                                                                                }

                                                                                                                                                            }
                                                                                                                                                            if(Array.isArray(nineteen)) {
                                                                                                                                                                let length = eightteen.el.length;
                                                                                                                                                                eightteen[level] = nineteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                                                if(eightteen.type === 'and' && eightteen.el.length != length) {
                                                                                                                                                                    deleteEightteen = true
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                            if(hasBad(nineteen, mixins))
                                                                                                                                                                delete eightteen[level]
                                                                                                                                                            if(nineteen.type === 'or' && nineteen.el.length === 1)
                                                                                                                                                                eightteen[level] = nineteen.el[0]
                                                                                                                                                            /*if(deleteNineteen)
                                                                                                                                                                delete eightteen[level];*/
                                                                                                                                                        }

                                                                                                                                                    }
                                                                                                                                                    if(Array.isArray(eightteen)) {
                                                                                                                                                        let length = seventeen.el.length;
                                                                                                                                                        seventeen[level] = eightteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                                        if(seventeen.type === 'and' && seventeen.el.length != length) {
                                                                                                                                                            deleteSeventeen = true
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    if(hasBad(eightteen, mixins))
                                                                                                                                                        delete seventeen[level]
                                                                                                                                                    if(eightteen.type === 'or' && eightteen.el.length === 1)
                                                                                                                                                        seventeen[level] = eightteen.el[0]
                                                                                                                                                    /*if(deleteEightteen)
                                                                                                                                                        delete seventeen[level];*/
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if(Array.isArray(seventeen)) {
                                                                                                                                                let length = sixteen.el.length;
                                                                                                                                                sixteen[level] = seventeen.filter(value => Object.keys(value).length > 0)
                                                                                                                                                if(sixteen.type === 'and' && sixteen.el.length != length) {
                                                                                                                                                    deleteSixteen = true
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if(hasBad(seventeen, mixins))
                                                                                                                                                delete sixteen[level]
                                                                                                                                            if(seventeen.type === 'or' && seventeen.el.length === 1)
                                                                                                                                                sixteen[level] = seventeen.el[0]
                                                                                                                                            /*if(deleteSeventeen)
                                                                                                                                                delete sixteen[level];*/
                                                                                                                                        }

                                                                                                                                    }
                                                                                                                                    if(Array.isArray(sixteen)) {
                                                                                                                                        let length = fifteen.el.length;
                                                                                                                                        fifteen[level] = sixteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                        if(fifteen.type === 'and' && fifteen.el.length != length) {
                                                                                                                                            deleteFifteen = true
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    if(hasBad(sixteen, mixins))
                                                                                                                                        delete fifteen[level]
                                                                                                                                    if(sixteen.type === 'or' && sixteen.el.length === 1)
                                                                                                                                        fifteen[level] = sixteen.el[0]
                                                                                                                                    /*if(deleteSixteen)
                                                                                                                                        delete fifteen[level];*/
                                                                                                                                }

                                                                                                                            }
                                                                                                                            if(Array.isArray(fifteen)) {
                                                                                                                                let length = fourteen.el.length;
                                                                                                                                fourteen[level] = fifteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                if(fourteen.type === 'and' && fourteen.el.length != length) {
                                                                                                                                    deleteFourteen = true
                                                                                                                                }
                                                                                                                            }
                                                                                                                            if(hasBad(fifteen, mixins))
                                                                                                                                delete fourteen[level]
                                                                                                                            if(fifteen.type === 'or' && fifteen.el.length === 1)
                                                                                                                                fourteen[level] = fifteen.el[0]
                                                                                                                            /*if(deleteFifteen)
                                                                                                                                delete fourteen[level];*/
                                                                                                                        }

                                                                                                                    }
                                                                                                                    if(Array.isArray(fourteen)) {
                                                                                                                        let length = thirteen.el.length;
                                                                                                                        thirteen[level] = fourteen.filter(value => Object.keys(value).length > 0)
                                                                                                                        if(thirteen.type === 'and' && thirteen.el.length != length) {
                                                                                                                            deleteThirteen = true
                                                                                                                        }
                                                                                                                    }
                                                                                                                    if(hasBad(fourteen, mixins))
                                                                                                                        delete thirteen[level]
                                                                                                                    if(fourteen.type === 'or' && fourteen.el.length === 1)
                                                                                                                        thirteen[level] = fourteen.el[0]
                                                                                                                    /*if(deleteFourteen)
                                                                                                                        delete thirteen[level];*/
                                                                                                                }

                                                                                                            }
                                                                                                            if(Array.isArray(thirteen)) {
                                                                                                                let length = twelve.el.length;
                                                                                                                twelve[level] = thirteen.filter(value => Object.keys(value).length > 0)
                                                                                                                if(twelve.type === 'and' && twelve.el.length != length) {
                                                                                                                    deleteTwelve = true
                                                                                                                }
                                                                                                            }
                                                                                                            if(hasBad(thirteen, mixins))
                                                                                                                delete twelve[level]
                                                                                                            if(thirteen.type === 'or' && thirteen.el.length === 1)
                                                                                                                twelve[level] = thirteen.el[0]
                                                                                                            /*if(deleteThirteen)
                                                                                                                delete twelve[level];*/
                                                                                                        }

                                                                                                    }
                                                                                                    if(Array.isArray(twelve)) {
                                                                                                        let length = eleven.el.length;
                                                                                                        eleven[level] = twelve.filter(value => Object.keys(value).length > 0)
                                                                                                        if(eleven.type === 'and' && eleven.el.length != length) {
                                                                                                            deleteEleven = true
                                                                                                        }
                                                                                                    }
                                                                                                    if(hasBad(twelve, mixins))
                                                                                                        delete eleven[level]
                                                                                                    if(twelve.type === 'or' && twelve.el.length === 1)
                                                                                                        eleven[level] = twelve.el[0]
                                                                                                    /*if(deleteTwelve)
                                                                                                        delete eleven[level];*/
                                                                                                }

                                                                                            }
                                                                                            if(Array.isArray(eleven)) {
                                                                                                let length = ten.el.length;
                                                                                                ten[level] = eleven.filter(value => Object.keys(value).length > 0)
                                                                                                if(ten.type === 'and' && ten.el.length != length) {
                                                                                                    deleteTen = true
                                                                                                }
                                                                                            }
                                                                                            if(hasBad(eleven, mixins))
                                                                                                delete ten[level]
                                                                                            if(eleven.type === 'or' && eleven.el.length === 1)
                                                                                                ten[level] = eleven.el[0]
                                                                                            /*if(deleteEleven)
                                                                                                delete ten[level];*/
                                                                                        }

                                                                                    }
                                                                                    if(Array.isArray(ten)) {
                                                                                        let length = nine.el.length;
                                                                                        nine[level] = ten.filter(value => Object.keys(value).length > 0)
                                                                                        if(nine.type === 'and' && nine.el.length != length) {
                                                                                            deleteNine = true
                                                                                        }
                                                                                    }
                                                                                    if(hasBad(ten, mixins))
                                                                                        delete nine[level]
                                                                                    if(ten.type === 'or' && ten.el.length === 1)
                                                                                        nine[level] = ten.el[0]
                                                                                    /*if(deleteTen)
                                                                                        delete nine[level];*/
                                                                                }
                                                                            }
                                                                            if(Array.isArray(nine)) {
                                                                                let length = eight.el.length;
                                                                                eight[level] = nine.filter(value => Object.keys(value).length > 0)
                                                                                if(eight.type === 'and' && eight.el.length != length) {
                                                                                    deleteEight = true
                                                                                }
                                                                            }
                                                                            if(hasBad(nine, mixins))
                                                                                delete eight[level]
                                                                            if(nine.type === 'or' && nine.el.length === 1)
                                                                                eight[level] = nine.el[0]
                                                                            /*if(deleteNine)
                                                                                delete eight[level];*/
                                                                        }

                                                                    }
                                                                    if(Array.isArray(eight)) {
                                                                        let length = seven.el.length;
                                                                        seven[level] = eight.filter(value => Object.keys(value).length > 0)
                                                                        if(seven.type === 'and' && seven.el.length != length) {
                                                                            deleteSeven = true
                                                                        }
                                                                    }
                                                                    if(hasBad(eight, mixins))
                                                                        delete seven[level]
                                                                    if(eight.type === 'or' && eight.el.length === 1)
                                                                        seven[level] = eight.el[0]
                                                                    /*if(deleteEight)
                                                                        delete seven[level];*/
                                                                }

                                                            }
                                                            if(Array.isArray(seven)) {
                                                                let length = six.el.length;
                                                                six[level] = seven.filter(value => Object.keys(value).length > 0)
                                                                if(six.type === 'and' && six.el.length != length) {
                                                                    deleteSix = true
                                                                }
                                                            }
                                                            if(hasBad(seven, mixins))
                                                                delete six[level]
                                                            if(seven.type === 'or' && seven.el.length === 1)
                                                                six[level] = seven.el[0]
                                                            /*if(deleteSeven)
                                                                delete six[level]*/
                                                        }

                                                    }
                                                    if(Array.isArray(six)) {
                                                        let length = five.el.length;
                                                        five[level] = six.filter(value => Object.keys(value).length > 0)
                                                        if(five.type === 'and' && five.el.length != length) {
                                                            deleteFive = true
                                                        }
                                                    }
                                                    if(hasBad(six, mixins))
                                                        delete five[level]
                                                    if(six.type === 'or' && six.el.length === 1)
                                                        five[level] = six.el[0]
                                                    /*if(deleteSix)
                                                        delete five[level]*/
                                                }

                                            }
                                            if(Array.isArray(five)) {
                                                let length = four.el.length;
                                                four[level] = five.filter(value => Object.keys(value).length > 0)
                                                if(four.type === 'and' && four.el.length != length) {
                                                    deleteFour = true
                                                }
                                            }
                                            if(hasBad(five, mixins))
                                                delete four[level]
                                            if(five.type === 'or' && five.el.length === 1)
                                                four[level] = five.el[0]
                                            /*if(deleteFive)
                                                delete four[level];*/
                                        }

                                    }
                                    if(Array.isArray(four)) {
                                        let length = three.el.length;
                                        three[level] = four.filter(value => Object.keys(value).length > 0)
                                        if(three.type === 'and' && three.el.length != length) {
                                            deleteThree = true
                                        }
                                    }
                                    if(hasBad(four, mixins))
                                        delete three[level]
                                    if(four.type === 'or' && four.el.length === 1)
                                        three[level] = four.el[0]
                                    /*if(deleteFour)
                                        delete three[level];*/
                                }

                            }
                            if(Array.isArray(three)) {
                                let length = two.el.length;
                                two[level] = three.filter(value => Object.keys(value).length > 0)
                                if(two.type === 'and' && two.el.length != length) {
                                    deleteTwo = true
                                }
                            }
                            if(hasBad(three, mixins))
                                delete two[level]
                            if(three.type === 'or' && three.el.length === 1)
                                two[level] = three.el[0]
                            /*if(deleteThree)
                                delete two[level];*/
                        }

                    }
                    if(Array.isArray(two))
                        one[level] = two.filter(value => Object.keys(value).length > 0)
                    if(hasBad(two, mixins))
                        delete one[level]
                    if(two.type === 'or' && two.el.length === 1)
                        one[level] = two.el[0]
                    /*if(deleteTwo)
                        delete one[level];*/
                }

            }
            if(Array.isArray(one))
                res.edges[topLevel] = one.filter(value => Object.keys(value).length > 0)
            if(hasBad(one, mixins))
                delete res.edges[topLevel]
        }

    }

    return res
}