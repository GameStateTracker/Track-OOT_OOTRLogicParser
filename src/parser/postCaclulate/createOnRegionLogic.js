export default function createOnRegionLogic(nodeC, elC, nodeA, elA, basic = false) {
    if (basic) {
        return {
            "type": "or",
            "el": [
                {
                    "type": "at",
                    "node": nodeC,
                    "el": elC
                },
                {
                    "type": "at",
                    "node": nodeA,
                    "el": elA
                }
            ]
        }
    } else {
        return {
            "type": "or",
            "el": [
                {
                    "type": "and",
                    "el": [
                        {
                            "type": "not",
                            "el": {
                                "type": "and",
                                "el": [
                                    {
                                        "type": "state",
                                        "el": "filter.era_apply",
                                        "value": "force",
                                        "category": "filter"
                                    },
                                    {
                                        "type": "state",
                                        "el": "filter.era",
                                        "value": "adult",
                                        "category": "filter"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "at",
                            "node": nodeC,
                            "el": elC
                        }
                    ]
                },
                {
                    "type": "and",
                    "el": [
                        {
                            "type": "not",
                            "el": {
                                "type": "and",
                                "el": [
                                    {
                                        "type": "state",
                                        "el": "filter.era_apply",
                                        "value": "force",
                                        "category": "filter"
                                    },
                                    {
                                        "type": "state",
                                        "el": "filter.era",
                                        "value": "child",
                                        "category": "filter"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "at",
                            "node": nodeA,
                            "el": elA
                        }
                    ]
                }
            ]
        }
    }
}
