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

    <button class="knightAddBtn" @click="toggleForm">
      {{ isFormVisible ? "Cancelar Registro" : "Adicionar Cavaleiro" }}
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
            <td class="tableActions">
              <button class="detailsBtn" @click="showDetails(knight)">Detalhes</button>
              <button class="editBtn" @click="editNickname(knight.id)">Editar</button>
              <button class="deleteBtn" @click="removeKnight(knight.id)">Promover</button>
              <button class="battleBtn" @click="initiateBattle(knight)" v-if="!knight.isHero">Batalhar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Exibir batalha -->
      <div v-if="battleState.isBattling" class="battleContainer">
        <h3>Batalha em Progresso</h3>
        <p>
          <b>{{ battleState?.knight1?.name ?? 'Selecione um Cavaleiro' }}</b> está enfrentando
          <b>{{ battleState?.knight2?.name ?? 'Selecione um Cavaleiro' }}</b>!
        </p>
        <button @click="resolveBattle" class="heroesBtn">Resolver Batalha</button>
        <button @click="cancelBattle" class="heroesBtn">Cancelar</button>
      </div>

      <div v-if="selectedKnight && !battleState.isBattling" class="detailsContainer">
        <h3>Detalhes do Cavaleiro</h3>
        <p>
          <b>Nome:</b> {{ selectedKnight.name }} / 
          <b>Nickname:</b> {{ selectedKnight.nickname }} /
          <b>Idade:</b> {{ calculateAge(selectedKnight.birthday) }} /
          <b>Atributo Chave:</b> {{ selectedKnight.keyAttribute }} /
          <b>Herói:</b> {{ selectedKnight.isHero ? "Sim" : "Não" }}
        </p>
        <p>
          <b>Armas:</b>
          <ul>
            <li v-for="(weapon, index) in selectedKnight.weapons" :key="index">
              {{ weapon.name }} (Mod: {{ weapon.mod }}, Atributo: {{ weapon.attr }},Equipado: {{ weapon.equipped ? "Sim" : "Não" }})
            </li>
          </ul>
        </p>
        <p><b>Atributos:</b></p>
        <ul>
          <li v-for="(value, key) in selectedKnight.attributes" :key="key">
            {{ key }}: {{ value }}
          </li>
        </ul>
        <button class="closeBtn" @click="selectedKnight = null">Fechar</button>
      </div>

      <div v-if="isFormVisible && !battleState.isBattling">
        <h3 class="titleAdd">Deseja inscrever um novo mebro na taverna?</h3>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getKnights, createKnight, updateKnight, deleteKnight, type Knight, getHeroKnights } from '../services/knightService';
import { useToast } from "vue-toastification";
import "./KnightList.css";

export default defineComponent({
  name: 'KnightTable',
  data() {
    return {
      toast: useToast(),
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
      isFormVisible: false,
      selectedKnight: null as Knight | null,
      battleState: {
        isBattling: false,
        knight1: null as Knight | null,
        knight2: null as Knight | null,
      },
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
      this.isShowingHeroes = !this.isShowingHeroes;
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },
    showDetails(knight: Knight) {
      this.selectedKnight = knight;
    },
    async addKnight() {
      try {
        const knight = await createKnight(this.newKnight);
        this.knights.push(knight);
        this.resetForm();
        await this.fetchKnights();
      } catch (error) {
        this.toast.success('Erro ao adicionar cavaleiro');
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
          this.toast.error('Erro ao editar nickname');
          console.error('Erro ao editar nickname:', error);
        }
      }
    },
    async removeKnight(id: number) {
      if (confirm('Tem certeza que deseja promover este cavaleiro?')) {
        try {
          const index = this.knights.findIndex((knight) => knight.id === id);

          if (index !== -1 && this.knights[index].isHero) {
            this.toast.error('Esse cavaleiro ja foi promovido ao Hall dos Heróis');
          }

          await deleteKnight(id);
          this.toast.success('Cavaleiro promovido ao Hall dos Heróis');
          if (index !== -1) {
            this.knights[index].isHero = true;
          }
        } catch (error) {
          this.toast.error('Erro ao promover cavaleiro');
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
      const calculateAttributeModifier = (value: number): number => {
        if (value >= 0 && value <= 8) return -2;
        if (value >= 9 && value <= 10) return -1;
        if (value >= 11 && value <= 12) return 0;
        if (value >= 13 && value <= 15) return 1;
        if (value >= 16 && value <= 18) return 2;
        if (value >= 19 && value <= 20) return 3;
        return 0;
      };

      const keyAttributeValue = knight.attributes[knight.keyAttribute] || 0;
      const keyAttrModifier = calculateAttributeModifier(keyAttributeValue);

      const weaponMod = knight.weapons
        .filter((weapon) => weapon.equipped)
        .reduce((sum, weapon) => sum + weapon.mod, 0);

      return 10 + keyAttrModifier + weaponMod;
    },
    calculateExp(age: number): number {
      if (age < 7) return 0;
      return Math.floor((age - 7) * Math.pow(22, 1.45));
    },
    initiateBattle(knight: Knight) {
      if(this.calculateAge(knight.birthday.toString()) < 18){
        this.toast.error('Você não pode colocar menores de idade para lutar :(');
        return;
      }
      if (this.battleState.isBattling) {
        this.battleState.knight2 = knight;
      } else {
        this.battleState.knight1 = knight;
        this.battleState.isBattling = true;
      }
    },
    cancelBattle() {
      this.battleState = {
        isBattling: false,
        knight1: null,
        knight2: null,
      };
    },
    async resolveBattle() {
      const { knight1, knight2 } = this.battleState;

      if (!knight1 || !knight2) {
        this.toast.warning("Selecione dois cavaleiros para a batalha!");
        return;
      }

      const attack1 = this.calculateAttack(knight1);
      const attack2 = this.calculateAttack(knight2);

      if (attack1 > attack2) {
        this.toast.success(`${knight1.name} venceu a batalha contra ${knight2.name}!`);
        await this.removeKnight(knight2.id);
      } else if (attack2 > attack1) {
        this.toast.success(`${knight2.name} venceu a batalha contra ${knight1.name}!`);
        await this.removeKnight(knight1.id);
      } else {
        this.toast.success("A batalha terminou em empate!");
      }

      this.cancelBattle();
      this.fetchKnights();
    },
  },
  mounted() {
    this.fetchKnights();
  },
});
</script>