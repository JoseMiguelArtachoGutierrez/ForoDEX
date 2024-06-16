import social from './assets/img/social.png'

function Inicio() {
    return <div className="inicio">
        <section>
            <div>
                <h1>ForoDex</h1>
                <h3>The best Pokemon website</h3>
            </div>
        </section>
        <section>
            <article>
                <h2>Ultimate Pokémon Wiki: Capture, Battle, and Connect!</h2>
                <p>
                    Welcome to our Pokémon website! <br/><br/>
                    Here, you can enjoy an exciting game where you have the opportunity to capture Pokémon from all generations. Each Pokémon is unique, meaning your captures will be special and different from those of other players. You can form your own Pokémon team of up to 6 members and proudly showcase it to our community. Join us and demonstrate your skills as a Pokémon Trainer. Catch, train, and share your adventures with other Pokémon fans!
                </p>
            </article>
            <article>
                <div><img src={social} alt="" /></div>
            </article>
        </section>
        <section>
            <article>
                <div><img src="" alt="" /></div>
                <div>
                    <h3>WikiDEX</h3>
                    <p>
                        Discover our comprehensive Pokédex that features every Pokémon from all generations. Easily search and filter through Pokémon using our intuitive filters and search bar. Find detailed information on each Pokémon, including stats, evolutions, and more.
                        <br/><br/>
                        Additionally, our wiki provides extensive data on items, moves, and type charts. You can explore the properties of each move and item, making it a valuable resource for both new and experienced Pokémon trainers. With all this information at your fingertips, mastering the world of Pokémon has never been easier!
                    </p>
                </div>
            </article>
            <article>
                <div><img src="" alt="" /></div>
                <div>
                    <h3>GameDEX</h3>
                    <p>Dive into our thrilling game where you can capture Pokémon from any existing generation. Each day, you have the opportunity to catch up to 6 unique Pokémon, making every capture session exciting and strategic. With a variety of Poké Balls at your disposal, each offering different capture rates, you can enhance your chances of adding rare and powerful Pokémon to your collection. Enjoy the adventure and expand your Pokédex daily!</p>
                </div>
            </article>
            <article>
                <div><img src="" alt="" /></div>
                <div>
                    <h3>ForoDEX</h3>
                    <p>Connect with fellow Pokémon enthusiasts in our vibrant forum! Here, you can chat with others, share strategies, and discuss all things Pokémon. Show off your hard-earned Pokémon teams by posting them for everyone to see. Our ranking system allows community members to like and vote for their favorite teams, giving you a chance to climb the leaderboard and gain recognition for your efforts. Join the conversation and become a part of our thriving Pokémon community today!</p>
                </div>
            </article>
        </section>
    </div>
}
export default Inicio