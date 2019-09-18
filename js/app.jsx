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

    class Pagination extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                page: this.props.page,
                pagesNumber: this.props.pagesNumber,
                offset: this.props.offset,
                paginationMaxSize: 1,
                paginationActualSize: 1,
                paginationInitialNumber: 1
            }
        }

        componentWillMount() {
            this.calculatePagerSizes();
        }

        componentDidMount() {
            let paginationParams = {
                page: this.state.page,
                paginationActualSize: this.state.paginationActualSize,
                paginationInitialNumber: this.state.paginationInitialNumber
            }

            let pagesInitialParams = {
                page: this.state.page,
                pagesNumber: this.state.pagesNumber
            }

            this.createPagination(paginationParams);
            this.createPages(pagesInitialParams);
            this.changeDisplayedDiv(this.state.page)
        }

        createPages(pagesInitialParams) {
            let pagesContainer = document.querySelector('.viewer__container');
            pagesContainer.innerHTML = '';

            for (let i=1; i <= pagesInitialParams.pagesNumber; i++) {
                let newPage = document.createElement('div');
                pagesContainer.append(newPage);
                newPage.innerText = 'Div ' + i;
                newPage.className = i===pagesInitialParams.page ? 'viever__inside-page visible' : 'viever__inside-page';
                newPage.id = i;
            }   
        }

        createPaginationExactSizes(inputSizes) {
            let paginationMaxSize = 2*Number(inputSizes.offset)+1;
            let paginationActualSize = (paginationMaxSize > Number(inputSizes.pagesNumber)) ? Number(inputSizes.pagesNumber) : paginationMaxSize;
         
            let paginationInitialNumber = 1;

            if ((inputSizes.page-inputSizes.offset <= 0) || (inputSizes.page+inputSizes.offset > inputSizes.pagesNumber)) {
                if (inputSizes.page-inputSizes.offset <= 0) {
                    paginationInitialNumber = 1; 
                }

                if (inputSizes.page+inputSizes.offset > inputSizes.pagesNumber) {
                    paginationInitialNumber = Number(inputSizes.pagesNumber) - paginationActualSize+1;
                }
            } else {
                paginationInitialNumber = inputSizes.page - inputSizes.offset;
            }

            let partialSizes = {
                paginationMaxSize: paginationMaxSize,
                paginationActualSize: paginationActualSize,
                paginationInitialNumber: paginationInitialNumber,
            } 

            return partialSizes;
        }

        calculatePagerSizes() {
            let initialInputs = {
                page: this.state.page,
                pagesNumber: this.state.pagesNumber,
                offset: this.state.offset
            }

            let partialSizes = this.createPaginationExactSizes(initialInputs);
       
            this.setState({
                page: initialInputs.page,
                pagesNumber: initialInputs.pagesNumber,
                offset: initialInputs.offset,
                paginationMaxSize: partialSizes.paginationMaxSize,
                paginationActualSize: partialSizes.paginationActualSize,
                paginationInitialNumber: partialSizes.paginationInitialNumber
            });
        }  

        changePagination(e) {
            let newPage = Number(e.target.innerText);   
            let startingParameters = {
                page: newPage,
                pagesNumber: this.state.pagesNumber,
                offset: this.state.offset
            }
            let partialSizes = this.createPaginationExactSizes(startingParameters);

            this.setState({
                page: newPage,
                pagesNumber: this.state.pagesNumber,
                offset: this.state.offset,
                paginationMaxSize: partialSizes.paginationMaxSize,
                paginationActualSize: partialSizes.paginationActualSize,
                paginationInitialNumber: partialSizes.paginationInitialNumber
            }, function() {

                let divs = document.querySelectorAll('.pagination__page');
                divs.forEach(element => element.className="pagination__page");
                
                let paginationParams = {
                    page: newPage,
                    paginationActualSize: partialSizes.paginationActualSize,
                    paginationInitialNumber: partialSizes.paginationInitialNumber
                }
                this.createPagination(paginationParams);
                this.changeDisplayedDiv(newPage);
            });
        }

        createPagination(paginationParams) {
            let container = document.querySelector('.pagination__paginator-container');
            container.innerHTML = '';
            let self = this;
            for (let i=0; i < paginationParams.paginationActualSize; i++) {
                let pagerItem = document.createElement('button');
                container.append(pagerItem);
                pagerItem.innerText = i+paginationParams.paginationInitialNumber;
                pagerItem.className = (i+paginationParams.paginationInitialNumber)===paginationParams.page 
                ? 'pagination__page pagination__page--active' : 'pagination__page';
                pagerItem.id = 'pager-' + (i+paginationParams.paginationInitialNumber);
                pagerItem.addEventListener('click', function(e) {
                    self.changePagination(e);
                });
            }
        }

        changeDisplayedDiv(page) {
            let oldVisibleElement = document.querySelector('.visible');
            if (oldVisibleElement) {
                oldVisibleElement.classList.toggle('visible');
            }
            let newEl = document.getElementById(page);
            if (newEl) {
                newEl.classList.add('visible');
            }
        }

        handlePageInput(event) {
            let pagesStartingParams = {};
            pagesStartingParams.page = event.target.name === 'page' ? Number(event.target.value) : this.state.page;
            pagesStartingParams.pagesNumber = event.target.name === 'pagesNumber' ? Number(event.target.value) : this.state.pagesNumber;
            pagesStartingParams.offset = event.target.name === 'offset' ? Number(event.target.value) : this.state.offset;

            // code below prevents user from typing to hight values of page and offset when compared to pagesNumber 
            // without the code no page is displayed (no div) and also there is no error in the console
            // usage of this code depends on expectations of component behaviour
            if (pagesStartingParams.page > pagesStartingParams.pagesNumber) {
                pagesStartingParams.page = pagesStartingParams.pagesNumber
            }
            if (pagesStartingParams.offset > Math.floor(pagesStartingParams.pagesNumber/2)) {
                pagesStartingParams.offset = Math.floor(pagesStartingParams.pagesNumber/2);
            }

            let isPageNumberChanged = event.target.name === 'pagesNumber';
            let partialSizes = this.createPaginationExactSizes(pagesStartingParams);

            this.setState({
                page: pagesStartingParams.page,
                pagesNumber: pagesStartingParams.pagesNumber,
                offset: pagesStartingParams.offset,
                paginationMaxSize: partialSizes.paginationMaxSize,
                paginationActualSize: partialSizes.paginationActualSize,
                paginationInitialNumber: partialSizes.paginationInitialNumber
            }, function() {
                let pagesInitialParams = {
                    page: pagesStartingParams.page,
                    pagesNumber: pagesStartingParams.pagesNumber,
                }
                isPageNumberChanged ? this.createPages(pagesInitialParams) : null;
                let divs = document.querySelectorAll('.pagination__page');
                divs.forEach(element => element.className="pagination__page");
                let paginationParams = {
                    page: pagesStartingParams.page,
                    paginationActualSize: partialSizes.paginationActualSize,
                    paginationInitialNumber: partialSizes.paginationInitialNumber
                }
                this.createPagination(paginationParams);
                this.changeDisplayedDiv(pagesStartingParams.page);
            });
        }

        render(){
            return(
                <div>
                    <div className="viewer__container">
                    </div>
                    <div className="pagination__paginator-container">
                    </div>
                    <form className="pagination__inputs">
                        <label>
                            Strona
                            <input name="page" type="number" placeholder="Wybierz stronę" value={this.state.page} 
                                onChange={this.handlePageInput.bind(this)} min="1" max={this.state.pagesNumber} />
                        </label>
                        <span>z</span>
                        <label aria-label="liczba stron">
                            <input name="pagesNumber" type="number" placeholder="Liczba stron" 
                                value={this.state.pagesNumber} onChange={this.handlePageInput.bind(this)} min="1" />
                        </label>
                        <label>
                            Offset
                            <input name="offset" type="number" placeholder="Offset:" 
                                value={this.state.offset} onChange={this.handlePageInput.bind(this)} min="0" 
                                max={Math.floor(this.state.pagesNumber/2)} />
                        </label>
                    </form>
                </div>
            )
        }
    }

    class Main extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                offset: 3,
                page: 8,
                pagesNumber: 13
            }
        }

        render(){
            return(
                <Pagination offset={this.state.offset} page={this.state.page} pagesNumber={this.state.pagesNumber} 
                    onPageChange={this.onPageChange}/>
            )
        }
    }

    class Footer extends React.Component{
        render(){
            return(
                <footer className="footer__container">
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