import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function(){
    class Header extends React.Component{
        render(){
            return(
                <h1>Paginacja</h1>
            )
        }
    }

    class Viewer extends React.Component{
        constructor(props){
            super(props);
        }

        render(){
            const subpages = Array(this.props.pagesNumber).fill().map( (subpage, index) => {
                let dod = (index+1)===this.props.page ? 'viever__inside-page visible' : 'viever__inside-page';
                return <div className={dod} data-counter={'element-'+index-+1} id={index-+1} key={index-+1}>Div {index+1}</div>
            });
            return(
                <div className="viewer__container">
                    {subpages}
                </div>
            )
        }
    }

    class Pagination extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                page: this.props.page,
                pagesNumber: this.props.pagesNumber,
                offset: this.props.offset,
                paginationMaxSize: 1,
                paginationActualSize: 1,
                paginationActivePosition: 1, 
                paginationInitialNumber: 1
            }
        }

        componentWillMount() {
            this.calculatePagerSizes();
        }

        handlePageInput(event) {
            console.log('event.target.value', event.target.value)
            this.setState({
                page: event.target.value
            })
            // this.props.onPageChange(event.target.value)
            // this.onPageChange(e);
          }

        calculatePagerSizes() {
            let paginationMaxSize = 2*Number(this.state.offset)+1;
            let paginationActualSize = (paginationMaxSize > Number(this.state.pagesNumber)) ? Number(this.state.pagesNumber) : paginationMaxSize;
         
            let paginationActivePosition = 1;
            let paginationInitialNumber = 1;

            if ((this.state.page-this.state.offset <= 0) || (this.state.page+this.state.offset > this.state.pagesNumber)) {
                if (this.state.page-this.state.offset <= 0) {
                    paginationInitialNumber = 1; 
                    paginationActivePosition = Number(this.state.page) - paginationInitialNumber;

                }

                if (this.state.page+this.state.offset > this.state.pagesNumber) {
                    paginationInitialNumber = Number(this.state.pagesNumber) - paginationActualSize+1;
                    paginationActivePosition = Number(this.state.pagesNumber) - paginationInitialNumber;
                }
            } else {
                paginationActivePosition = this.state.offset + 1;
                paginationInitialNumber = this.state.page - this.state.offset;
            }

            let originalState = this.state;
            this.setState({
                page: this.props.page,
                pagesNumber: this.props.pagesNumber,
                offset: this.props.offset,
                paginationMaxSize: paginationMaxSize,
                paginationActualSize: paginationActualSize,
                paginationActivePosition: paginationActivePosition, 
                paginationInitialNumber: paginationInitialNumber
            });

        }  

        changePagination(e) {
        let newPage = Number(e.target.innerText);   

        let divs = document.querySelectorAll('.pagination__page').forEach(element => element.className="pagination__page");
        document.getElementById(this.state.page).classList.toggle('pagination__page--active');
        this.forceUpdate();
        //document.querySelector('.pagination__paginator-container').getElementById(this.state.page).;
        let self = this;

        let paginationMaxSize = 2*Number(this.state.offset)+1;
            let paginationActualSize = (paginationMaxSize > Number(this.state.pagesNumber)) ? Number(this.state.pagesNumber) : paginationMaxSize;
         
            let paginationActivePosition = 1;
            let paginationInitialNumber = 1;

            if ((this.state.page-this.state.offset <= 0) || (this.state.page+this.state.offset > this.state.pagesNumber)) {
                if (this.state.page-this.state.offset <= 0) {
                    paginationInitialNumber = 1; 
                    paginationActivePosition = Number(this.state.page) - paginationInitialNumber;

                }

                if (this.state.page+this.state.offset > this.state.pagesNumber) {
                    paginationInitialNumber = Number(this.state.pagesNumber) - paginationActualSize+1;
                    paginationActivePosition = Number(this.state.pagesNumber) - paginationInitialNumber;
                }
            } else {
                paginationActivePosition = this.state.offset + 1;
                paginationInitialNumber = this.state.page - this.state.offset;
            }


        // this.setState({
        //     page: newPage,
        //     pagesNumber: self.state.pagesNumber,
        //     offset: self.state.offset,
        //     paginationMaxSize: paginationMaxSize,
        //     paginationActualSize: paginationActualSize,
        //     paginationActivePosition: paginationActivePosition, 
        //     paginationInitialNumber: paginationInitialNumber
        // });
        // console.log(this.state, 'state')
        // this.calculatePagerSizes();
        }

        render(){
            console.log('render')
            let paginationElements = Array(this.state.paginationActualSize).fill().map( (subpage, index) => {
                let classDefinition = (index+1)===this.state.paginationActivePosition ? 'pagination__page pagination__page--active' : 'pagination__page';
                return <button type="button" className={classDefinition} 
                id={index+this.state.paginationInitialNumber} key={'key'+index} onClick={this.changePagination.bind(this)}>{index+this.state.paginationInitialNumber}</button>
            });

            return(
                <div>
                    <div className="pagination__paginator-container">
                        {paginationElements}
                    </div>
         
                    <label>
                        Strona
                        <input type="number" placeholder="Wybierz stronę" value={this.state.page} onChange={this.handlePageInput} min="1" max={this.props.pagesNumber}/>
                        {/* //<input type="number" placeholder="Wybierz stronę" value={this.state.inputValue} onChange={this.updateInputValue}/> */}
                        
                    </label>
                    <span>z</span>
                    <label>
                        <input type="number" placeholder="Liczba stron" value={this.state.pagesNumber} min="1"/>
                    </label>

                </div>
            )
        }
    }

    class Main extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                offset: 3,
                page: 2,
                pagesNumber: 3
            }
        }

        onPageChange(value) {
            console.log('wyzej')
            this.setState({
                page: value
            })
        }

        render(){
            return(
                <div>
                    <Viewer offset={this.state.offset} page={this.state.page} pagesNumber={this.state.pagesNumber} />
                    <Pagination offset={this.state.offset} page={this.state.page} pagesNumber={this.state.pagesNumber} onPageChange={this.onPageChange}/>
                </div>
            )
        }
    }

    class Footer extends React.Component{
        render(){
            return(
                <footer>
                    <span>Made by Anna Stachurska, 2019</span>
                </footer>
            )
        }
    }

    class App extends React.Component{
        render(){
            return(
                <section>
                    <Header />
                    <Main />
                    <Footer />
                </section>
            )
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );

});