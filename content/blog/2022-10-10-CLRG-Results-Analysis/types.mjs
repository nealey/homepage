/**
 * A collection of results
 * @typedef {Array.<Result>} Results
 */

/**
 * A single result
 * 
 * @typedef {Object} Result
 * @property {String} name Competitor's name
 * @property {Number} number Competitor's bib number
 * @property {String} school Competitor's school
 * @property {Number} overallPoints Overall award points for this competitor
 * @property {Number} overallRank Overall ranking for this competitor
 * @property {String} qualifier Any qualifiers this ranking earned
 * @property {Array.<Round>} rounds How this competitor was judged in each round
 */

/**
 * The results for one dancer for one round
 * 
 * @typedef Round
 * @type {Array.<Adjudication>}
 */

/**
 * One adjudicator's results for one dancer for one round
 * @typedef {Object} Adjudication
 * @property {String} adjudicator Adjudicator who recorded this score
 * @property {Number} raw Raw score
 * @property {Number} placing Placing relative to this adjudicator's other scores
 * @property {Number} points Award points
 *  @property {Boolean} tie Whether this score was a tie
 */
