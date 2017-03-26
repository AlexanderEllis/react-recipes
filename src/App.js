import React, { Component } from 'react';
import './App.css';
import { Button, Modal } from 'react-bootstrap';

var RECIPES = [
  { recipeName: 'Pie',
    ingredients: ['Butter', 'Apples'],
    id: 0,
    editing: false 
  },
  { recipeName: 'Omlette',
    ingredients: ['Butter', 'Eggs'],
    id: 1,
    editing: false
  }
];

class RecipeInteractions extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
  }

  close() {
    // Change editing to false without saving
    this.props.close()
  }

  save() {
    const ingredientList = this.refs['ingredient-list'].value;  // We added a ref to the input and can now access it here.
    this.props.save(ingredientList);
    // Sends new ingredient list to parent and changes editing to false
  }

  open() {
    this.props.edit()
  }
  
  delete() {
    // Send Id to parents to delete
    this.props.delete()
  }

  render() {
    let ingredients = this.props.ingredients.join(', ');
    return (
      <div>

        <Button
          bsSize="small"
          onClick={this.open}
        >
         Edit Recipe 
        </Button>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={this.delete}
        >
         Delete Recipe 
        </Button>

        <Modal show={this.props.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.recipeName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Enter ingredients separated by a comma and a space, eg "Apples, Butter"</p>
            <input type="text" defaultValue={ingredients} ref="ingredient-list"></input> 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button bsStyle="primary" onClick={this.save}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.close = this.close.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  edit() {
    this.props.edit(this.props.id); // We use these intermediate steps to pass the ID as well
  }

  save(ingredientList) {
    this.props.save(ingredientList, this.props.id);
  }
  
  close() {
    this.props.close(this.props.id);
  }

  delete() {
    this.props.delete(this.props.id);
  }

  render() {
    let ingredients = this.props.ingredients;
    let list = [];
    for (let i = 0; i < ingredients.length; i++) {
      list.push(<li key={ingredients[i]}>{ingredients[i]}</li>)
    }
    return (
      <div className="Recipe panel" style={{ width: '40%'}} >
        <div className="panel-body">
          <h2 >{this.props.recipeName}</h2>
          <ul className="recipe-items">
            {list}
          </ul>
          <RecipeInteractions
            showModal={this.props.editing}
            recipeName={this.props.recipeName}
            ingredients={ingredients}
            edit={this.edit}
            save={this.save}
            close={this.close}
            delete={this.delete}
          />
        </div>
      </div>
    )
  }
}

class AddRecipeModal extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.save = this.save.bind(this);
  }

  close() {
    // Change adding to false without saving
    this.props.close()
  }

  save() {
    const recipeName = this.refs['recipe-name'].value; // Added ref to input to access
    const ingredientList = this.refs['ingredient-list'].value;  // We added a ref to the input and can now access it here.
    this.props.save(recipeName, ingredientList);
    // TODO: Send recipe name and ingredient list to parent
  }

  open() {
    this.props.open()
  }
  
  render() {
    return (
      <div>

        <Button
          bsSize="small"
          onClick={this.open}
        >
         Add Recipe 
        </Button>

        <Modal show={this.props.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              <input type="text" placeholder="Recipe name" ref="recipe-name"></input>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Enter ingredients separated by a comma and a space, eg "Apples, Butter"</p>
            <input type="text" placeholder="Apples, Butter" ref="ingredient-list"></input> 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button bsStyle="primary" onClick={this.save}>Save Recipe</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
                    recipes: RECIPES,
                    adding: false,
                    lastId: 1
                  };
                  
    this.editRecipe = this.editRecipe.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.closeRecipe = this.closeRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeAddModal = this.closeAddModal.bind(this);
  }
  
  saveRecipe(ingredientList, idToMatch) {
    let tempRecipes = this.state.recipes;
    for (let i = 0; i < tempRecipes.length; i++) {
      if (tempRecipes[i].id === idToMatch) {
        tempRecipes[i].ingredients = ingredientList.split(', ');
        tempRecipes[i].editing = false;
        break;
      }
    }
    this.setState({ 
                    recipes: tempRecipes,
                    adding: false,
                    lastId: this.state.lastId
                  });  
  }
  
  editRecipe(idToMatch) {
    let tempRecipes = this.state.recipes;
    for (let i = 0; i < tempRecipes.length; i++) {
      if (tempRecipes[i].id === idToMatch) {
        tempRecipes[i].editing = true;
        break;
      }
    }
    this.setState({ 
                    recipes: tempRecipes,
                    adding: false,
                    lastId: this.state.lastId
                  });  
  }

  closeRecipe(idToMatch) {
    let tempRecipes = this.state.recipes;
    for (let i = 0; i < tempRecipes.length; i++) {
      if (tempRecipes[i].id === idToMatch) {
        tempRecipes[i].editing = false;
        break;
      }
    }
    this.setState({ 
                    recipes: tempRecipes,
                    adding: false,
                    lastId: this.state.lastId
                  });  
  }

  deleteRecipe(idToMatch) {
    let tempRecipes = this.state.recipes;
    for (let i = 0; i < tempRecipes.length; i++) {
      if (tempRecipes[i].id === idToMatch) {
        tempRecipes.splice(i, 1)
        break;
      }
    }
    this.setState({ 
                    recipes: tempRecipes,
                    adding: false,
                    lastId: this.state.lastId
                  });
  }

  openAddModal() {
    this.setState({ 
                    recipes: this.state.recipes,
                    adding: true,
                    lastId: this.state.lastId
                  })
  }

  closeAddModal() {
   this.setState({ 
                    recipes: this.state.recipes,
                    adding: false,
                    lastId: this.state.lastId
                  }) 
  }
  
  addRecipe(recipeName, ingredientList) {
    if (recipeName === '' || ingredientList === '') {
      this.setState({
                    recipes: this.state.recipes,
                    adding: false,
                    lastId: this.state.lastId
                  });
      return;
    }
    let newId = this.state.lastId + 1;
    
    let newRecipe = { recipeName: recipeName,
                      ingredients: ingredientList.split(', '),
                      id: newId,
                      editing: false };
                      
    let tempRecipes = this.state.recipes
    tempRecipes.push(newRecipe);

    this.setState({
                    recipes: tempRecipes,
                    adding: false,
                    lastId: newId
                  });
  }
  
  render() {
    let recipes = this.state.recipes
    let recipeElements = []
    for (let i = 0; i < recipes.length; i++) {
      recipeElements.push(<Recipe
                            recipeName={recipes[i].recipeName}
                            ingredients={recipes[i].ingredients}
                            editing={recipes[i].editing}
                            key={recipes[i].id}
                            id={recipes[i].id}
                            edit={this.editRecipe}
                            save={this.saveRecipe}
                            close={this.closeRecipe}
                            delete={this.deleteRecipe}
                          />)
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Recipe Box</h2>
        </div>
        <p className="App-intro">
          To get started, click Add Recipe.
        </p>
        <AddRecipeModal 
          open={this.openAddModal}
          close={this.closeAddModal}
          save={this.addRecipe}
          showModal={this.state.adding}
        />


        {recipeElements}
      </div>
    );
  }
}



export default RecipeBox;
