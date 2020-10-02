import React, { useState, useEffect } from 'react';
import './memory.css';


const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const Memory = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [steps, setSteps] = useState(0)
    const [solvedCards, setsolvedCards] = useState([]);
    const [disable, setDisable] = useState(false);

    const onClick = (idx) => {
        if (disable == false && solvedCards.includes(idx) === false) {
            if (flipped.length < 2 && flipped.includes(idx) == false) {
                setFlipped([...flipped, idx]);
            }
            if (flipped.length > 0) {
                if (cards[flipped[0]].id === cards[idx].id && flipped[0] !== idx) {
                    setsolvedCards([...solvedCards, flipped[0], idx]);
                    setSteps(steps+1)
                    setFlipped([]);
                }
                else if(flipped[0] !== idx) { 
                    setDisable(true);
                    setSteps(steps+1)
                    setTimeout(() => {
                        setFlipped([])
                        setDisable(false);
                    }, 1000)
                }
            }
        }
    }

    useEffect(() => {
        if(solvedCards.length == 40) {
            alert(`well done! steps: ${steps}`)
        }
    }, [solvedCards])

    useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character/')
            .then(res => res.json())
            .then(({ results }) => {
                const paths = results.map(({image, id}) => {
                    return {
                        image, id
                    }
                });
                const cards = paths.concat(paths);
                shuffleArray(cards);
                setCards(cards);
            })
    }, []);

    return <div className="board">
        <h1>Your steps {steps}</h1>
        {cards.map((card, idx) => <div className="card" key={idx}>
          <img onClick={()=> {onClick(idx)}}  width="150" src={flipped.includes(idx) || solvedCards.includes(idx) ? card.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTuZ_BEPJuL-5TwnJOujngdGvujcGzH_jqyrw&usqp=CAU"}/>
        </div>)}
    </div>
}

export default Memory;