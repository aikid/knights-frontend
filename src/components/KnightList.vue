<template>
  <div>
    <h1>Taverna dos Cavaleiros</h1>
    <p>
      Seja bem-vindo ao Reino!<br />
      Você pode criar um cavaleiro, renomear um cavaleiro e promover um cavaleiro ou deletá-lo.<br />
      E como bônus você pode também colocar um cavaleiro para lutar contra outro.<br />
      <b>Não coloque menores de idade para lutar >.<</b>
    </p>

    <button class="heroesBtn" @click="toggleHeroKnights">
      {{ isShowingHeroes ? "Mostrar Todos" : "Mostrar Heróis" }}
    </button>

    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Nickname</th>
          <th>Idade</th>
          <th>Armas</th>
          <th>Atributo</th>
          <th>Ataque</th>
          <th>Exp</th>
          <th>Herói?</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="knight in knights" :key="knight.id">
            <td>{{ knight.name }}</td>
            <td>{{ knight.nickname }}</td>
            <td>{{ calculateAge(knight.birthday) }}</td>
            <td>{{ knight.weapons.length }}</td>
            <td>{{ knight.keyAttribute }}</td>
            <td>{{ calculateAttack(knight) }}</td>
            <td>{{ calculateExp(calculateAge(knight.birthday)) }}</td>
            <td>{{ knight.isHero ? "Sim" : "Não" }}</td>
            <td>
              <button class="editBtn" @click="editNickname(knight.id)">Editar Nickname</button>
              <button class="deleteBtn" @click="removeKnight(knight.id)">Deletar(Promover)</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="titleAdd">Deseja inscrever um novo mebro na taverna?</h3>
      <!-- Formulário para adicionar cavaleiros -->
      <form @submit.prevent="addKnight" class="formAdd">
        <div>
          <label for="name">Nome:</label>
          <input id="name" v-model="newKnight.name" placeholder="Nome" required />
        </div>
        <div>
          <label for="nickname">Apelido:</label>
          <input id="nickname" v-model="newKnight.nickname" placeholder="Apelido" required />
        </div>
        <div>
          <label for="birthday">Data de Nascimento:</label>
          <input id="birthday" v-model="newKnight.birthday" type="date" required />
        </div>
        <div>
          <label for="keyAttribute">Atributo Chave:</label>
          <select id="keyAttribute" v-model="newKnight.keyAttribute" required>
            <option value="Strength">Strength</option>
            <option value="Dexterity">Dexterity</option>
            <option value="Intelligence">Intelligence</option>
            <option value="Constitution">Constitution</option>
            <option value="Wisdom">Wisdom</option>
            <option value="Charisma">Charisma</option>
          </select>
        </div>

        <!-- Seção de Armas -->
        <div>
          <label>Armas:</label>
          <button type="button" @click="addWeapon">Adicionar Arma</button>
          <ul>
            <li v-for="(weapon, index) in newKnight.weapons" :key="index">
              <input v-model="weapon.name" placeholder="Nome da Arma" required />
              <input v-model.number="weapon.mod" type="number" placeholder="Modificador" required />
              <input v-model="weapon.attr" placeholder="Atributo da Arma" required />
              <select v-model="weapon.equipped" required>
                <option value="">Equiado?</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
              <button type="button" @click="removeWeapon(index)">Remover</button>
            </li>
          </ul>
        </div>

        <!-- Seção de Atributos -->
        <div>
          <label>Atributos:</label>
          <div v-for="(value, attr) in newKnight.attributes" :key="attr">
            <label>{{ attr }}:</label>
            <input v-model.number="newKnight.attributes[attr]" type="number" required />
          </div>
          <button type="button" @click="addAttribute">Adicionar Atributo</button>
        </div>

      <button class="addBtn" type="submit">Registrar Cavaleiro</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getKnights, createKnight, updateKnight, deleteKnight, type Knight, getHeroKnights } from '../services/knightService';

export default defineComponent({
  name: 'KnightTable',
  data() {
    return {
      knights: [] as Knight[],
      newKnight: {
        name: '',
        nickname: '',
        birthday: new Date(),
        keyAttribute: '',
        weapons: [],
        attributes: { 
          strength: 0, 
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0
        },
        isHero: false,
      },
      isShowingHeroes: false,
    };
  },
  methods: {
    async fetchKnights() {
      this.knights = await getKnights();
    },
    async fetchHeroKnights() {
      this.knights = await getHeroKnights();
    },
    async toggleHeroKnights() {
      if (this.isShowingHeroes) {
        await this.fetchKnights();
      } else {
        await this.fetchHeroKnights();
      }
      this.isShowingHeroes = !this.isShowingHeroes; // Alterna o estado
    },
    async addKnight() {
      try {
        const knight = await createKnight(this.newKnight);
        this.knights.push(knight);
        this.resetForm();
        await this.fetchKnights();
      } catch (error) {
        console.error("Erro ao adicionar cavaleiro:", error);
      }
    },
    addWeapon() {
      this.newKnight.weapons.push({ name: "", mod: 0, attr: "", equipped: false });
    },
    removeWeapon(index: number) {
      this.newKnight.weapons.splice(index, 1);
    },
    addAttribute() {
      const attrName = prompt("Digite o nome do atributo:");
      if (attrName && !(attrName in this.newKnight.attributes)) {
        this.newKnight.attributes = {
          ...this.newKnight.attributes,
          [attrName]: 0
        };
      }
    },
    resetForm() {
      this.newKnight = {
        name: "",
        nickname: "",
        birthday: new Date,
        keyAttribute: "",
        weapons: [],
        attributes: { 
          strength: 0, 
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0
        },
        isHero: false,
      };
    },
    async editNickname(id: number) {
      const newNickname = prompt('Digite o novo nickname:');
      if (newNickname) {
        try {
          const updatedKnight = await updateKnight(id, newNickname);
          const index = this.knights.findIndex((knight) => knight.id === id);
          if (index !== -1) {
            this.knights[index].nickname = updatedKnight.nickname;
          }
        } catch (error) {
          console.error('Erro ao editar nickname:', error);
        }
      }
    },
    async removeKnight(id: number) {
      if (confirm('Tem certeza que deseja promover este cavaleiro?')) {
        try {
          const index = this.knights.findIndex((knight) => knight.id === id);

          if (index !== -1 && this.knights[index].isHero) {
            alert('Esse cavaleiro ja foi promovido ao Hall dos Heróis');
          }

          await deleteKnight(id);
          
          if (index !== -1) {
            this.knights[index].isHero = true;
          }
        } catch (error) {
          console.error('Erro ao deletar cavaleiro:', error);
        }
      }
    },
    calculateAge(birthday: string): number {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    calculateAttack(knight: Knight): number {
      const baseAttack = 10;
      const mod = knight.attributes[knight.keyAttribute] || 0;
      const weaponMod =
        knight.weapons.reduce((sum: any, weapon: { mod: any; }) => sum + weapon.mod, 0) || 0;
      return baseAttack + mod + weaponMod;
    },
    calculateExp(age: number): number {
      if (age < 7) return 0;
      return Math.floor((age - 7) * Math.pow(22, 1.45));
    },
  },
  mounted() {
    this.fetchKnights();
  },
});
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #5c5c5c;
    padding: 20px;
    text-align: center;
  }

  th {
    background-color: #696969;
    color: #fff;
  }

  .editBtn{
    background: #f5c527;
    color: #fff;
    margin-right: 5px;
  }

  .deleteBtn{
    background: #f73f3f;
    color: #fff;
  }

  .addBtn{
    background: #6ff332 !important;
    color: #fff;
    margin-top: 50px;
  }

  .heroesBtn{
    margin-top: 20px;
    color: #fff;
    background-color: #696969;
  }

  .formAdd div {
    display: grid;
  }

  .formAdd label{
    text-align: left;
  }

  .formAdd input, .formAdd select{
    height: 40px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .formAdd button {
    background-color: #e3e3e3;
  }

  .titleAdd{
    margin-top: 20px;
  }

  .formAdd ul{
    list-style: none;
    padding: 0;
  }

  .formAdd ul li {
    text-align: left;
  }

  .formAdd ul li input, .formAdd ul li select {
    margin-right: 15px;
    width: 21%;
  }
</style>